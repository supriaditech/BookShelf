import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '@/utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'projectBOOKshelf543345'; // Ganti dengan secret yang aman

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
      verify(token, JWT_SECRET);

      // Ambil ID dari body request
      const { id } = req.body;

      // Validasi ID
      if (!id) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse('ID is required', null, StatusCodes.BAD_REQUEST),
          );
      }

      // Hapus kategori berdasarkan ID
      const deletedBook = await prisma.book.delete({
        where: { id: Number(id) },
      });

      return res
        .status(StatusCodes.OK)
        .json(
          createResponse(
            'Book deleted successfully',
            deletedBook,
            StatusCodes.OK,
          ),
        );
    } catch (error) {
      console.error(error);
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
