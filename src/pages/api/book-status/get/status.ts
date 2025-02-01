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

      // Ambil bookId dari query
      const { bookId } = req.query;

      if (!bookId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(
            createResponse(
              'Book ID is required',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      // Mendapatkan status baca buku untuk pengguna tertentu dan buku tertentu
      const userBookStatus = await prisma.userBookStatus.findUnique({
        where: {
          userId_bookId: {
            userId: userId, // Menggunakan userId dari token
            bookId: parseInt(bookId as string),
          },
        },
      });

      if (!userBookStatus) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            createResponse('Status not found', null, StatusCodes.NOT_FOUND),
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          createResponse(
            'Status retrieved successfully',
            userBookStatus,
            StatusCodes.OK,
          ),
        );
    } catch (error) {
      console.error('Error fetching user book status:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          createResponse(
            'Failed to fetch status',
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
          'Method Not Allowed',
          null,
          StatusCodes.METHOD_NOT_ALLOWED,
        ),
      );
  }
}
