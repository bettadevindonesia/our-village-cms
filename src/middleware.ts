"use server"

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { and, eq, gt } from 'drizzle-orm';
import { parse as parseSetCookie } from 'set-cookie-parser'; // Helper to parse cookies
import { users, userSessions } from 'db/schema';

/**
 * Middleware to protect routes.
 *
 * @param request The incoming NextRequest object.
 * @returns NextResponse to either allow or redirect the request.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define public paths that should not be protected
  const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/forgot-password', // Add forgot password path
    '/api/auth/callback', // Example if you have OAuth callbacks
    '/_next', // Next.js internals
    '/favicon.ico',
    '/robots.txt',
    '/images', // Public assets if served from /images
    // Add other explicitly public API routes if needed
  ];

  const authPages = [
    '/',
    '/login',
    '/signup',
    '/forgot-password'
  ];

  const isAuthPage = authPages.includes(pathname);

  // Check if the path is public
  const isPublicPath = publicPaths.some(path =>
    pathname.startsWith(path) || pathname === '/'
  );

  // Extract session token from cookies early
  let sessionToken: string | undefined;
  const sessionCookieHeader = request.headers.get('cookie');
  if (sessionCookieHeader) {
    const cookies = parseSetCookie(sessionCookieHeader, { decodeValues: false });
    const sessionTokenCookie = cookies.find(cookie => cookie.name === 'session_token');
    sessionToken = sessionTokenCookie?.value;
  }

  // 3. Check for existing session if user is trying to access auth pages
  if (isAuthPage && sessionToken) {
    try {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      const sessionResult = await db
        .select({
          userId: userSessions.userId,
          role: users.role,
          isActive: users.isActive,
        })
        .from(userSessions)
        .innerJoin(users, eq(userSessions.userId, users.id))
        .where(and(eq(userSessions.id, sessionToken), gt(userSessions.expiresAt, currentTimeInSeconds)))
        .limit(1);

      const session = sessionResult[0];

      // If a valid admin session is found, redirect to dashboard
      if (session && session.isActive && session.role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      // If session exists but user is not active or not admin, let them proceed to auth pages
      // Or if session is invalid/ expired, it will be handled later or cleared on login attempt

    } catch (error) {
      console.error("Error checking session in middleware for auth page:", error);
      // In case of DB error, we can choose to let the user proceed to the auth page
      // or redirect to login. Letting them proceed is safer to avoid lockouts.
    }
  }

  // 4. If it's a public path (and not a special case handled above), allow the request
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 5. For protected paths, check for authentication
  try {
    if (!sessionCookieHeader) {
       // No cookies, redirect to login (root)
       return NextResponse.redirect(new URL('/', request.url));
    }

    if (!sessionToken) {
       // No session token found, redirect to login (root)
       return NextResponse.redirect(new URL('/', request.url));
    }

    // 6. Validate session against the database
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const sessionResult = await db
      .select({
        userId: userSessions.userId,
        role: users.role,
        isActive: users.isActive,
      })
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(and(eq(userSessions.id, sessionToken), gt(userSessions.expiresAt, currentTimeInSeconds)))
      .limit(1);

    const session = sessionResult[0];

    if (!session || !session.isActive) {
      // No valid session found or user is inactive, redirect to login
      const response = NextResponse.redirect(new URL('/', request.url));
      // Clear the invalid session cookie
      response.cookies.set('session_token', '', { maxAge: 0, path: '/' });
      return response;
    }

    // 7. Authorization: Check if the user has the 'admin' role for dashboard
    if (pathname.startsWith('/dashboard')) {
       if (session.role !== 'admin') {
         // User is logged in but not an admin, redirect to login or a forbidden page
         return NextResponse.redirect(new URL('/', request.url));
       }
       // User is an admin, allow access to dashboard
       return NextResponse.next();
    }

    // 8. If it's a protected path but not specifically a dashboard path,
    // and the user has a valid session, allow access.
    // Add more granular role checks here if needed for other roles (official, staff)
    return NextResponse.next();

  } catch (error) {
    console.error("Middleware error:", error);
    // In case of an unexpected error during DB check, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
