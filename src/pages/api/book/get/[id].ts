import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { StatusCodes } from 'http-status-codes';
import { createResponse } from '@/utils/response';
import { verify } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'projectBokk'; // Ganti dengan secret yang aman

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

  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const decoded = verify(token, JWT_SECRET);

      const book = await prisma.book.findUnique({
        where: { id: Number(id) },
        include: { categories: true, UserBookStatus: true },
      });

      if (!book) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(createResponse('Book not found', null, StatusCodes.NOT_FOUND));
      }

      return res
        .status(StatusCodes.OK)
        .json(
          createResponse('Category get successfully', book, StatusCodes.OK),
        );
    } catch (error) {
      console.error('Error fetching category:', error);
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
