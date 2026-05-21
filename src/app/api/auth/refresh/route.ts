import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/tokens.server";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { isSuccess: false, message: "No refresh token" },
        { status: 401 },
      );
    }

    const nestRes = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!nestRes.ok) {
      await clearAuthCookies();
      return NextResponse.json(
        { isSuccess: false, message: "Session expired" },
        { status: 401 },
      );
    }

    const result = await nestRes.json();

    await setAuthCookies(result.accessToken, result.refreshToken);

    return NextResponse.json({ isSuccess: true, user: result.user });
  } catch {
    await clearAuthCookies();
    return NextResponse.json(
      { isSuccess: false, message: "Refresh failed" },
      { status: 401 },
    );
  }
}
