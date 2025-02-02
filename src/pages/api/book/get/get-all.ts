import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '@/utils/response';
import { verify } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'projectBOOKshelf543345'; // Ganti dengan secret yang aman

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(createResponse('Unauthorized', null, StatusCodes.UNAUTHORIZED));
  }

  if (req.method === 'POST') {
    try {
      // Mengambil semua kategori dari database
      const decoded = verify(token, JWT_SECRET);
      const book = await prisma.book.findMany({
        include: { categories: true, UserBookStatus: true },
      });
      return res
        .status(StatusCodes.OK)
        .json(createResponse('book get successfully', book, StatusCodes.OK));
    } catch (error) {
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
