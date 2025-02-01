import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '@/utils/response';
import path from 'path';
import { IncomingForm } from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';

const JWT_SECRET = process.env.JWT_SECRET || 'projectBokk'; // Ganti dengan secret yang aman
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
  // Cek metode request
  if (req.method === 'POST') {
    // Ambil token dari header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse('Unauthorized', null, StatusCodes.UNAUTHORIZED));
    }

    try {
      // Verifikasi token
      const decoded = verify(token, JWT_SECRET);

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

      // Validasi input
      const title = Array.isArray(fields.title)
        ? fields.title[0]
        : fields.title;
      const author = Array.isArray(fields.author)
        ? fields.author[0]
        : fields.author;
      const isbn = Array.isArray(fields.isbn) ? fields.isbn[0] : fields.isbn;

      const categoryIds = Array.isArray(fields.categoryIds)
        ? fields.categoryIds
        : [fields.categoryIds];

      if (!title || !author || !isbn || !categoryIds) {
        if (files.coverImage && files.coverImage.length > 0) {
          await fs.unlink(files.coverImage[0].filepath); // Hapus file jika ada
        }
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse(
              'Title, author, isbn, and categoryIds are required',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      // Validasi file
      if (files.coverImage && files.coverImage.length > 0) {
        const coverImage = files.coverImage[0]; // Akses elemen pertama dari array
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
      }

      // Generate coverImage URL
      const coverImageUrl =
        files.coverImage && files.coverImage.length > 0
          ? `/uploads/books/${path.basename(files.coverImage[0].filepath)}`
          : null;

      // Create book di database
      try {
        const newBook = await prisma.book.create({
          data: {
            title: title as string,
            author: author as string,
            isbn: isbn as string,
            coverImage: coverImageUrl,
            categories: {
              connect: categoryIds.map((id: string) => ({ id: parseInt(id) })),
            },
          },
        });

        // Kembalikan buku yang dibuat
        return res
          .status(StatusCodes.OK)
          .json(
            createResponse(
              'Book created successfully',
              newBook,
              StatusCodes.OK,
            ),
          );
      } catch (error: any) {
        console.error('Kesalahan saat membuat buku:', error);

        // Jika terjadi kesalahan unik pada isbn, hapus foto
        if (error.code === 'P2002') {
          // Prisma error code for unique constraint violation
          if (files.coverImage && files.coverImage.length > 0) {
            await fs.unlink(files.coverImage[0].filepath); // Hapus file jika ada
          }
          return res
            .status(StatusCodes.CONFLICT)
            .json(
              createResponse('ISBN must be unique', null, StatusCodes.CONFLICT),
            );
        }

        // Hapus foto jika terjadi kesalahan lain
        if (files.coverImage && files.coverImage.length > 0) {
          await fs.unlink(files.coverImage[0].filepath); // Hapus file jika ada
        }
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(
            createResponse(
              'Failed to create book',
              null,
              StatusCodes.INTERNAL_SERVER_ERROR,
            ),
          );
      }
    } catch (error) {
      console.error('Kesalahan saat memverifikasi token:', error); // Log kesalahan
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse('Invalid token', null, StatusCodes.UNAUTHORIZED));
    }
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json(
        createResponse(
          'Method Not Allowed',
          null,
          StatusCodes.METHOD_NOT_ALLOWED,
        ),
      );
  }
}
