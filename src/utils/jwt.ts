// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'projectBokk'; // Pastikan untuk mengatur JWT_SECRET di .env

export const generateToken = (payload: any, options?: jwt.SignOptions) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secretKey);
};
