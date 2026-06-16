import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicRoutes, protectedRoutes, adminRoutes } from "./lib/auth-routes";
import { TOKEN_KEYS } from "./constants/tokenKeys.constants";
import { Locale } from "./enums/locale.enum";
import { API_ENDPOINTS } from "./lib/apiEndpoints";
import { TokenSession } from "./types/tokenSession.type";

type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
};

const intlMiddleware = createMiddleware(routing);

function stripLocale(pathname: string): string {
  return pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/|$)/, "") || "/";
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
}

function getLocalePrefix(pathname: string): string {
  const match = pathname.match(/^(\/[a-z]{2}(-[A-Z]{2})?)/);
  return match?.[1] ?? Locale.EN;
}

// Edge-compatible JWT decoding (using atob instead of Buffer)
function decodeTokenPayload(token: string): (TokenSession & JwtPayload) | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    return JSON.parse(atob(base64.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip assets and internal APIs
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/_vercel/") ||
    pathname === "/favicon.ico" ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const clean = stripLocale(pathname);
  const locale = getLocalePrefix(pathname).replace("/", "") || "en";

  let accessToken = request.cookies.get(TOKEN_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(TOKEN_KEYS.REFRESH_TOKEN)?.value;

  // Initialize the response with i18n
  const response = intlMiddleware(request);

  // 2. ── SERVER-SIDE SILENT REFRESH ──────────────────────────────────────────
  // If access token is gone but refresh token exists, repair the session NOW
  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const result = await refreshRes.json();
        const data = result.result || result.data || result;

        // CRITICAL: Update local variable for the route checks below
        accessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        // Set cookies on the response object so the browser saves them
        response.cookies.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken!, {
          httpOnly: true,
          secure: process.env.NEXT_PUBLIC_ENV_TYPE === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 15, // 15 mins
        });

        response.cookies.set(TOKEN_KEYS.REFRESH_TOKEN, newRefreshToken!, {
          httpOnly: true,
          secure: process.env.NEXT_PUBLIC_ENV_TYPE === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }
    } catch (error) {
      console.error("[Middleware Refresh Error]:", error);
    }
  }

  // 3. ── AUTHORIZATION LOGIC ─────────────────────────────────────────────────
  const hasSession = !!accessToken;
  let role: string | null = null;

  if (accessToken) {
    const payload = decodeTokenPayload(accessToken);
    role = payload?.role ?? null;
  }

  const roleLower = role?.toLowerCase();
  const isAdmin = ["admin", "administrator", "owner"].includes(roleLower || "");

  // A. Public Routes (Auth pages) -> If logged in, go home
  if (matchesRoute(clean, publicRoutes) && hasSession) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // B. Admin Routes -> Must be logged in AND be admin
  if (matchesRoute(clean, adminRoutes)) {
    if (!hasSession) {
      const loginUrl = new URL(`/${locale}/auth`, request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // C. Protected Routes -> Must be logged in
  if (matchesRoute(clean, protectedRoutes) && !hasSession) {
    const loginUrl = new URL(`/${locale}/auth`, request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Return the response (carrying the updated cookies if refreshed)
  return response;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
