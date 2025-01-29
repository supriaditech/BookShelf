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

      // Ambil ID kategori dari parameter
      const categoryId = fields.id; // Pastikan ID kategori dikirim dalam form-data
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const slug = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;

      if (!categoryId || !name || !slug) {
        if (files.photo && files.photo.length > 0) {
          await fs.unlink(files.photo[0].filepath); // Hapus file jika ada
        }
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse(
              'ID, name, and slug are required',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      // Validasi file
      let photoUrl: string | null = null;
      if (files.photo && files.photo.length > 0) {
        const photo = files.photo[0]; // Akses elemen pertama dari array
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(photo.mimetype)) {
          await fs.unlink(photo.filepath); // Hapus file jika tipe tidak valid
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
          await fs.unlink(photo.filepath); // Hapus file jika ukuran terlalu besar
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

        // Generate photo URL
        photoUrl = `/uploads/categories/${path.basename(photo.filepath)}`;
      }

      // Update category di database
      try {
        const updatedCategory = await prisma.category.update({
          where: { id: categoryId },
          data: {
            name: name as string,
            slug: slug as string,
            photo: photoUrl, // Hanya update foto jika ada
          },
        });

        // Kembalikan kategori yang diperbarui
        return res
          .status(StatusCodes.OK)
          .json(
            createResponse(
              'Category updated successfully',
              updatedCategory,
              StatusCodes.OK,
            ),
          );
      } catch (error: any) {
        console.error('Kesalahan saat memperbarui kategori:', error);

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
              'Failed to update category',
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
