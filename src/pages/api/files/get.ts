import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (!filename || Array.isArray(filename)) {
    return res
      .status(400)
      .json({ error: 'Filename is required and must be a string' });
  }

  // Tentukan path file berdasarkan query string
  const filePath = path.join(process.cwd(), 'public', filename as string);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // Tentukan MIME type berdasarkan ekstensi file
  const ext = path.extname(filename as string).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  fs.createReadStream(filePath).pipe(res); // Mengirim file ke client
}
