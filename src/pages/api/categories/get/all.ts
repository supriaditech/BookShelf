import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { unstable_getServerSession } from 'next-auth/next';
import authOptions from '@/lib/auth';
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

  if (req.method === 'POST') {
    try {
      // Mengambil semua kategori dari database
      const decoded = verify(token, JWT_SECRET);
      const categories = await prisma.category.findMany();
      return res
        .status(StatusCodes.OK)
        .json(
          createResponse(
            'Category get successfully',
            categories,
            StatusCodes.OK,
          ),
        );
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
