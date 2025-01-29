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
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/categories');

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
      console.log('Token yang diterima:', token);
      // Verifikasi token
      const decoded = verify(token, JWT_SECRET);
      console.log('Token terverifikasi:', decoded); // Log hasil verifikasi

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

      console.log('Files yang diterima:', files);

      // Validasi input
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const slug = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;

      if (!name || !slug) {
        if (files.photo && files.photo.length > 0) {
          await fs.unlink(files.photo[0].filepath); // Hapus file jika ada
        }
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse(
              'Name and slug are required',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      // Validasi file
      if (files.photo && files.photo.length > 0) {
        const photo = files.photo[0]; // Akses elemen pertama dari array
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(photo.mimetype)) {
          await fs.unlink(photo.filepath);
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

        if (photo.size > 2 * 1024 * 1024) {
          await fs.unlink(photo.filepath);
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

      // Generate photo URL
      const photoUrl =
        files.photo && files.photo.length > 0
          ? `/uploads/categories/${path.basename(files.photo[0].filepath)}`
          : null;

      // Create category di database
      try {
        const newCategory = await prisma.category.create({
          data: {
            name: name as string,
            slug: slug as string,
            photo: photoUrl,
          },
        });

        // Kembalikan kategori yang dibuat
        return res
          .status(StatusCodes.OK)
          .json(
            createResponse(
              'Category created successfully',
              newCategory,
              StatusCodes.OK,
            ),
          );
      } catch (error: any) {
        console.error('Kesalahan saat membuat kategori:', error);

        // Jika terjadi kesalahan unik pada slug, hapus foto
        if (error.code === 'P2002') {
          // Prisma error code for unique constraint violation
          if (files.photo && files.photo.length > 0) {
            await fs.unlink(files.photo[0].filepath); // Hapus file jika ada
          }
          return res
            .status(StatusCodes.CONFLICT)
            .json(
              createResponse('Slug must be unique', null, StatusCodes.CONFLICT),
            );
        }

        // Hapus foto jika terjadi kesalahan lain
        if (files.photo && files.photo.length > 0) {
          await fs.unlink(files.photo[0].filepath); // Hapus file jika ada
        }
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(
            createResponse(
              'Failed to create category',
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
