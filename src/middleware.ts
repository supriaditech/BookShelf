import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Middleware yang dihasilkan dari next-intl
const intlMiddleware = createMiddleware(routing);

// Fungsi middleware kustom
export async function middleware(req: NextRequest, request: NextRequest) {
  // const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;
  const [, NEXT_LOCALE, ...segments] = pathname.split('/') || 'en'; // Ambil locale dari pathname

  let locale = NEXT_LOCALE ? NEXT_LOCALE : 'en';

  let isTokenExpired = null;

  if (token) {
    const expirationDate = new Date(Number(token.expiresIn)).getTime(); // Konversi ke timestamp
    const currentTime = Date.now(); // Waktu saat ini dalam milidetik

    // Jika token belum expired
    if (
      !token ||
      !token.accessToken ||
      !token.expiresIn ||
      currentTime < expirationDate
    ) {
      isTokenExpired = true; // Token valid
    } else {
      isTokenExpired = false;
    }
  } else {
    isTokenExpired = true;
  }

  // Jika tidak ada token, arahkan ke halaman login
  if (isTokenExpired) {
    if (pathname !== `/${locale}/login` && pathname !== `/${locale}/register`) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  } else {
    // Jika token valid dan pengguna mencoba mengakses halaman login atau register, arahkan ke halaman utama
    if (pathname === `/${locale}/login` || pathname === `/${locale}/register`) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(id|en)/:path*',
    '/home/:path*',
    '/login',
    '/register',
    '/profile/:path*',
    '/categories/:path*',
  ], // Tambahkan rute register
};
