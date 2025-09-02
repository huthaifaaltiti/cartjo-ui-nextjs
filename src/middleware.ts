// middleware.ts - Advanced version with auth protection
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { protectedRoutes, publicRoutes } from "./lib/auth-routes";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

const isPublicRoute = (pathname: string): boolean => {
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return publicRoutes.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(route + "/")
  );
};

const isProtectedRoute = (pathname: string): boolean => {
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";

  return protectedRoutes.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(route + "/")
  );
};

export default withAuth(
  function middleware(request: NextRequest) {
    // Skip middleware for API routes and static files
    if (
      request.nextUrl.pathname.startsWith("/api/") ||
      request.nextUrl.pathname.startsWith("/_next/") ||
      request.nextUrl.pathname.startsWith("/_vercel/") ||
      request.nextUrl.pathname.startsWith("/trpc/") ||
      request.nextUrl.pathname === "/favicon.ico" ||
      request.nextUrl.pathname.match(/\..+$/)
    ) {
      return NextResponse.next();
    }

    // Apply next-intl middleware for internationalization
    return intlMiddleware(request);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathnameSlug = req?.nextUrl?.pathname;

        // Always allow access to public routes
        if (isPublicRoute(pathnameSlug)) {
          return true;
        }

        // For protected routes, check if user is authenticated
        if (isProtectedRoute(pathnameSlug)) {
          return !!token;
        }

        // Allow access to all other routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
