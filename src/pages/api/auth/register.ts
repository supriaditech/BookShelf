// src/pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { createResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';
import { getCurrentLocalTime } from '@/utils/date-helper';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { username, email, password, name } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      const errorResponse = createResponse(
        'Semua field harus diisi',
        null,
        StatusCodes.BAD_REQUEST,
      );
      return res.status(errorResponse.meta.statusCode).json(errorResponse);
    }

    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        const errorResponse = createResponse(
          'Email sudah terdaftar',
          null,
          StatusCodes.CONFLICT,
        );
        return res.status(errorResponse.meta.statusCode).json(errorResponse);
      }

      // Hash password sebelum menyimpan ke database
      const hashedPassword = await bcrypt.hash(password, 10);
      const currentDateTime = getCurrentLocalTime();
      // Buat pengguna baru
      const user = await prisma.user.create({
        data: {
          username,
          email,
          name,
          password: hashedPassword,
          create_At: currentDateTime,
          update_At: currentDateTime,
        },
      });

      // Mengembalikan respons sukses
      const successResponse = createResponse(
        'Pengguna berhasil terdaftar',
        user,
        StatusCodes.CREATED,
      );
      return res.status(successResponse.meta.statusCode).json(successResponse);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorResponse = createResponse(
        error.message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
      return res.status(errorResponse.meta.statusCode).json(errorResponse);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    const errorResponse = createResponse(
      `Method ${req.method} Not Allowed`,
      null,
      StatusCodes.METHOD_NOT_ALLOWED,
    );
    return res.status(errorResponse.meta.statusCode).json(errorResponse);
  }
}
