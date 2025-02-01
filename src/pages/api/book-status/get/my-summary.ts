import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { verify } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '@/utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'projectBokk'; // Ganti dengan secret yang aman

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    // Ambil token dari header Authorization
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse('Unauthorized', null, StatusCodes.UNAUTHORIZED));
    }

    try {
      // Verifikasi token dan ambil userId dari payload
      const decoded: any = verify(token, JWT_SECRET);
      const userId = decoded.id; // Mengambil userId dari payload token

      // Ambil total buku yang dimiliki pengguna
      const totalBooks = await prisma.book.count();

      // Ambil total buku yang sedang dibaca
      const inProgressBooks = await prisma.userBookStatus.count({
        where: {
          userId: userId,
          status: 'IN_PROGRESS',
        },
      });

      // Ambil total buku yang selesai dibaca
      const completedBooks = await prisma.userBookStatus.count({
        where: {
          userId: userId,
          status: 'COMPLETED',
        },
      });

      return res.status(StatusCodes.OK).json(
        createResponse(
          'Book stats retrieved successfully',
          {
            totalBooks,
            inProgressBooks,
            completedBooks,
          },
          StatusCodes.OK,
        ),
      );
    } catch (error) {
      console.error('Error during token verification or processing:', error);
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
