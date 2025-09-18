"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { and, eq, gt } from "drizzle-orm";
import { parse as parseSetCookie } from "set-cookie-parser";
import { users, userSessions } from "db/schema";

/**
 * Middleware to protect routes.
 *
 * @param request The incoming NextRequest object.
 * @returns NextResponse to either allow or redirect the request.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/api/auth/callback",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/images",
  ];

  const authPages = ["/", "/login", "/signup", "/forgot-password"];

  const isAuthPage = authPages.includes(pathname);

  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path) || pathname === "/"
  );

  let sessionToken: string | undefined;
  const sessionCookieHeader = request.headers.get("cookie");
  if (sessionCookieHeader) {
    const cookies = parseSetCookie(sessionCookieHeader, {
      decodeValues: false,
    });
    const sessionTokenCookie = cookies.find(
      (cookie) => cookie.name === "session_token"
    );
    sessionToken = sessionTokenCookie?.value;
  }

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
        .where(
          and(
            eq(userSessions.id, sessionToken),
            gt(userSessions.expiresAt, currentTimeInSeconds)
          )
        )
        .limit(1);

      const session = sessionResult[0];

      if (session && session.isActive && session.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error(
        "Error checking session in middleware for auth page:",
        error
      );
    }
  }

  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    if (!sessionCookieHeader) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const sessionResult = await db
      .select({
        userId: userSessions.userId,
        role: users.role,
        isActive: users.isActive,
      })
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(
        and(
          eq(userSessions.id, sessionToken),
          gt(userSessions.expiresAt, currentTimeInSeconds)
        )
      )
      .limit(1);

    const session = sessionResult[0];

    if (!session || !session.isActive) {
      const response = NextResponse.redirect(new URL("/", request.url));

      response.cookies.set("session_token", "", { maxAge: 0, path: "/" });
      return response;
    }

    if (pathname.startsWith("/dashboard")) {
      if (session.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    return NextResponse.redirect(new URL("/", request.url));
  }
}

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
    "/((?!api|_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
