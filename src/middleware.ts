import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// Middleware yang dihasilkan dari next-intl
const intlMiddleware = createMiddleware(routing);

// Fungsi middleware kustom
export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;
  const locale = req.nextUrl.locale || 'en';

  if (!token) {
    if (pathname !== `/${locale}/login` && pathname !== `/${locale}/register`) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  } else {
    const tokenExp =
      typeof token.exp === 'number' ? token.exp : Number(token.exp); // Pastikan token.exp adalah number
    if (tokenExp && Date.now() >= tokenExp * 1000) {
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
    if (
      token &&
      (pathname === `/${locale}/login` || pathname === `/${locale}/register`)
    ) {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(id|en)/:path*', '/home/:path*', '/login', '/register'], // Tambahkan rute register
};
