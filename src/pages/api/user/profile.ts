// src/pages/api/user/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { createResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ganti dengan secret yang aman

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1]; // Ambil token dari header Authorization

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse('Token is required.', null, StatusCodes.UNAUTHORIZED),
        );
    }

    try {
      // Verifikasi token
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      // Ambil data pengguna dari database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          create_At: true,
          update_At: true,
        },
      });

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(createResponse('User not found.', null, StatusCodes.NOT_FOUND));
      }
      // Kembalikan data pengguna
      return res
        .status(StatusCodes.OK)
        .json(
          createResponse(
            'User profile retrieved successfully.',
            { user },
            StatusCodes.OK,
          ),
        );
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse('Invalid token.', null, StatusCodes.UNAUTHORIZED));
    }
  } else {
    // Metode tidak diizinkan
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json(
        createResponse(
          'Method not allowed.',
          null,
          StatusCodes.METHOD_NOT_ALLOWED,
        ),
      );
  }
}
