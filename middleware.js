import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  // console.log('🔥 Middleware running for:', request.url);
  
  // Await the cookies() function
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  
  const { pathname } = new URL(request.url);
  
  // Protected paths that require authentication
  const protectedPaths = [
    '/admin',
    '/admin/user-management',
    '/admin/subscriptions/plans',
    '/admin/subscriptions/subscribers',
    '/admin/products-management', 
    '/admin/review-management',
    '/admin/settings',
  ];
  
  const isProtected = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  
  // Handle root route ('/')
  if (pathname === '/') {
    if (token) {
      // console.log('Token exists, redirecting from / to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // No token, allow access to login page
    return NextResponse.next();
  }
  
  // Handle protected routes
  if (isProtected && !token) {
    // console.log(`No token, redirecting from ${pathname} to /`);
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
  ],
};