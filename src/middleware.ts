// Combined next-intl and NextAuth
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Skip middleware for NextAuth routes, API routes, and static files
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/_vercel/") ||
    request.nextUrl.pathname.startsWith("/trpc/") ||
    request.nextUrl.pathname === "/favicon.ico" ||
    request.nextUrl.pathname.match(/\..+$/) // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Apply next-intl middleware for internationalization
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - API routes and NextAuth
  // - Static files
  // - Files with extensions (e.g. favicon.ico)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
