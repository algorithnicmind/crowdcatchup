import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/authority',
  '/police',
  '/citizen',
  '/settings',
  '/owner',
];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  
  if (isProtected) {
    // Check for our custom auth cookie
    const token = req.cookies.get('auth_token')?.value;
    
    if (!token) {
      // Redirect to login if no token found
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is logged in, prevent them from going to login/register
  if (pathname === '/login' || pathname === '/register') {
    const token = req.cookies.get('auth_token')?.value;
    if (token) {
      // Decode or check role in a real app, here we just redirect to dashboard root
      return NextResponse.redirect(new URL('/authority', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
