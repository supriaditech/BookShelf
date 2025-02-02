// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { createResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET || 'projectBOOKshelf543345'; // Ganti dengan secret yang aman

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log('JWT_SECRET login', JWT_SECRET);
    // Validasi input
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          createResponse(
            'Email and password are required.',
            null,
            StatusCodes.BAD_REQUEST,
          ),
        );
    }

    try {
      // Cek apakah pengguna ada di database
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            createResponse(
              'Invalid email or password.',
              null,
              StatusCodes.UNAUTHORIZED,
            ),
          );
      }

      // Bandingkan password yang diberikan dengan password yang dihash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            createResponse(
              'Invalid email or password.',
              null,
              StatusCodes.BAD_REQUEST,
            ),
          );
      }

      // Buat access token
      const expiresIn = Math.floor(Date.now() / 1000) + 86400; // Waktu kedaluwarsa token untuk 1 hari
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn,
      });

      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: 60 * 60 * 24 * 7 }, // Refresh token kedaluwarsa dalam 7 hari
      );

      // Hitung waktu kedaluwarsa
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1); // Tambahkan 1 jam

      const dataUser = {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          create_At: user.create_At,
          update_At: user.update_At,
        },
        accessToken: token,
        refreshToken: refreshToken,
        expiresIn: expirationDate.toISOString(), // Kembalikan waktu kedaluwarsa dalam format ISO
      };

      // Kembalikan respons dengan token
      return res
        .status(StatusCodes.OK)
        .json(createResponse('Login successful.', dataUser, StatusCodes.OK));
    } catch (error) {
      console.error('Login error:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          createResponse(
            'Internal server error.',
            null,
            StatusCodes.BAD_GATEWAY,
          ),
        );
    }
  } else {
    // Metode tidak diizinkan
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json(
        createResponse('Internal server error.', null, StatusCodes.BAD_GATEWAY),
      );
  }
}
