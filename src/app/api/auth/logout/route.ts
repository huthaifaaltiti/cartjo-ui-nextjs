import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, getRefreshToken } from "@/lib/tokens.server";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lang = body?.lang ?? "en";
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      const response = await fetch(API_ENDPOINTS.AUTHORIZATION.LOGOUT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken, lang }),
        cache: "no-store",
      });

      const result = await response.json();

      await clearAuthCookies();

      return NextResponse.json(result);
    }

    return NextResponse.json({ isSuccess: true });
  } catch {
    await clearAuthCookies();

    return NextResponse.json({ isSuccess: true });
  }
}
