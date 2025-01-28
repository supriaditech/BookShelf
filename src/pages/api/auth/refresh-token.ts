import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createResponse } from '@/utils/response'; // Pastikan path ini sesuai dengan struktur proyek Anda
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET || 'projectBokk';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          createResponse(
            'Refresh token is required',
            null,
            StatusCodes.BAD_REQUEST,
          ),
        );
    }

    try {
      // Verifikasi refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload;

      // Pastikan decoded memiliki properti yang diharapkan
      if (!decoded.id || !decoded.email) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            createResponse(
              'Invalid refresh token',
              null,
              StatusCodes.UNAUTHORIZED,
            ),
          );
      }

      // Buat access token baru
      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        JWT_SECRET,
        { expiresIn: '1h' }, // Token kedaluwarsa dalam 1 jam
      );

      return res
        .status(StatusCodes.OK)
        .json(
          createResponse(
            'Access token refreshed successfully',
            { accessToken: newAccessToken },
            StatusCodes.OK,
          ),
        );
    } catch (error) {
      console.error('Refresh token error:', error);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          createResponse(
            'Invalid refresh token',
            null,
            StatusCodes.UNAUTHORIZED,
          ),
        );
    }
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json(
        createResponse(
          'Method not allowed',
          null,
          StatusCodes.METHOD_NOT_ALLOWED,
        ),
      );
  }
}
