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

  // If user is logged in, prevent them from going to login/register unless explicitly requesting a role change
  if (pathname === '/login' || pathname === '/register') {
    const requestedRole = req.nextUrl.searchParams.get('role');
    
    // If they explicitly clicked a button for a specific role, let them see the login page
    // so they can log in as that new role or create an account.
    if (requestedRole) {
      return NextResponse.next();
    }

    const token = req.cookies.get('auth_token')?.value;
    const role = req.cookies.get('auth_role')?.value;
    
    if (token) {
      if (role === 'CITIZEN') {
        return NextResponse.redirect(new URL('/citizen', req.url));
      } else if (role === 'POLICE') {
        return NextResponse.redirect(new URL('/police', req.url));
      } else if (role === 'EVENT_OWNER') {
        return NextResponse.redirect(new URL('/owner', req.url));
      } else if (role === 'AUTHORITY') {
        return NextResponse.redirect(new URL('/authority', req.url));
      }
      
      // If we have a token but no role (legacy cookie), we should ideally clear it,
      // but for safety, we'll just let them reach the login page to re-authenticate.
      return NextResponse.next();
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
