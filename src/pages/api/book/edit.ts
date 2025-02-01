import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '@/utils/response';
import path from 'path';
import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { ReadingStatus } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'projectBokk';
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/books');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse('Unauthorized', null, StatusCodes.UNAUTHORIZED));
    }

    try {
      verify(token, JWT_SECRET);

      const form = new IncomingForm({
        uploadDir: UPLOAD_DIR,
        keepExtensions: true,
        multiples: false,
        filename: (name, ext) => `${uuidv4()}${ext}`,
      });

      const [fields, files] = await new Promise<[any, any]>(
        (resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve([fields, files]);
          });
        },
      );

      // Handle categoryIds input (support array & comma-separated string)
      let categoryIds: string[] = [];
      if (Array.isArray(fields.categoryIds)) {
        categoryIds = fields.categoryIds;
      } else if (typeof fields.categoryIds === 'string') {
        categoryIds = fields.categoryIds.split(',').map((id: any) => id.trim());
      }

      // Validasi input
      const bookId = Number(fields.id);
      const title = fields.title?.[0] || fields.title;
      const author = fields.author?.[0] || fields.author;
      const isbn = fields.isbn?.[0] || fields.isbn;

      if (!bookId || !title || !author || !isbn || categoryIds.length === 0) {
        if (files.coverImage?.[0])
          await fs.unlink(files.coverImage[0].filepath);
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse(
              'Missing required fields',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      // Validasi kategori
      const categoryIdsParsed = categoryIds.map((id) => parseInt(id));
      if (categoryIdsParsed.some(isNaN)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse(
              'Invalid category ID format',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      const validCategories = await prisma.category.findMany({
        where: { id: { in: categoryIdsParsed } },
        select: { id: true },
      });

      if (validCategories.length !== categoryIdsParsed.length) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse(
              'Invalid category IDs',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      // Cek buku existing
      const existingBook = await prisma.book.findUnique({
        where: { id: bookId },
        include: { categories: true },
      });

      if (!existingBook) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(createResponse('Book not found', null, StatusCodes.NOT_FOUND));
      }

      // Handle file upload
      let coverImageUrl: string | null = null;
      if (files.coverImage?.[0]) {
        const coverImage = files.coverImage[0];

        // Validasi file
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(coverImage.mimetype)) {
          await fs.unlink(coverImage.filepath);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
              createResponse(
                'Invalid file type',
                null,
                StatusCodes.BAD_REQUEST,
              ),
            );
        }

        if (coverImage.size > 2 * 1024 * 1024) {
          await fs.unlink(coverImage.filepath);
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json(
              createResponse(
                'File size exceeds 2MB',
                null,
                StatusCodes.BAD_REQUEST,
              ),
            );
        }

        // Hapus file lama jika ada
        if (existingBook.coverImage) {
          const oldFilePath = path.join(
            process.cwd(),
            'public',
            existingBook.coverImage,
          );
          await fs.unlink(oldFilePath).catch(() => {});
        }

        coverImageUrl = `/uploads/books/${path.basename(coverImage.filepath)}`;
      }

      // Cek perubahan data
      const isSameData =
        existingBook.title === title &&
        existingBook.author === author &&
        existingBook.isbn === isbn &&
        existingBook.categories
          .map((c) => c.id.toString())
          .sort()
          .join(',') === categoryIds.sort().join(',');

      if (isSameData && !coverImageUrl) {
        return res
          .status(StatusCodes.OK)
          .json(
            createResponse('No changes detected', existingBook, StatusCodes.OK),
          );
      }

      // Update buku
      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: {
          title,
          author,
          isbn,
          coverImage: coverImageUrl || existingBook.coverImage,
          categories: {
            set: validCategories.map((cat) => ({ id: cat.id })),
          },
        },
        include: {
          categories: true,
        },
      });

      return res
        .status(StatusCodes.OK)
        .json(
          createResponse(
            'Book updated successfully',
            updatedBook,
            StatusCodes.OK,
          ),
        );
    } catch (error) {
      console.error('Error updating book:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          createResponse(
            'Internal server error',
            null,
            StatusCodes.INTERNAL_SERVER_ERROR,
          ),
        );
    }
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json(
        createResponse(
          'Method not allowed',
          null,
          StatusCodes.METHOD_NOT_ALLOWED,
        ),
      );
  }
}
