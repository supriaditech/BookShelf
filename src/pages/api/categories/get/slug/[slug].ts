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

  const { slug } = req.query;
  const page = parseInt(req.query.page as string) || 1; // Halaman yang diminta
  const limit = parseInt(req.query.limit as string) || 10; // Jumlah item per halaman
  const offset = (page - 1) * limit; // Menghitung offset

  if (req.method === 'POST') {
    try {
      const decoded = verify(token, JWT_SECRET);

      // Mengambil kategori berdasarkan slug dan menerapkan paginasi
      const category = await prisma.category.findUnique({
        where: { slug: String(slug) },
        include: {
          books: {
            skip: offset,
            take: limit,
          },
        },
      });

      if (!category) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(
            createResponse('Category not found', null, StatusCodes.NOT_FOUND),
          );
      }

      return res
        .status(StatusCodes.OK)
        .json(
          createResponse(
            'Category retrieved successfully',
            category,
            StatusCodes.OK,
          ),
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
