import { NextResponse } from 'next/server';

// Route protection: runs on the server before a page renders.
// No token cookie -> /login. Token cookie on /login -> /products.
export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === '/login';

  if (!token && !isLoginPage) {
    const url = new URL('/login', request.url);
    if (pathname !== '/') url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/products', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/login', '/products/:path*'] };
