import { NextApiRequest, NextApiResponse } from 'next';
import { createResponse } from '@/utils/response';
import { StatusCodes } from 'http-status-codes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      // Dapatkan token dari cookies atau header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(
            createResponse(
              'Unauthorized: No token found.',
              null,
              StatusCodes.UNAUTHORIZED,
            ),
          );
      }

      // Hapus token dari cookies
      res.setHeader(
        'Set-Cookie',
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly',
      );

      // Kembalikan respons sukses
      return res
        .status(StatusCodes.OK)
        .json(createResponse('Logout successful.', null, StatusCodes.OK));
    } catch (error) {
      console.error('Logout error:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(
          createResponse(
            'Internal server error.',
            null,
            StatusCodes.INTERNAL_SERVER_ERROR,
          ),
        );
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
