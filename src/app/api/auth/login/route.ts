import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/tokens.server";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, lang, rememberMe } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { isSuccess: false, message: "Identifier and password are required" },
        { status: 400 },
      );
    }

    const nestRes = await fetch(API_ENDPOINTS.AUTHORIZATION.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": req.headers.get("x-forwarded-for") ?? "",
        "User-Agent": req.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify({ identifier, password, lang, rememberMe }),
      cache: "no-store",
    });

    const result = await nestRes.json();

    if (!nestRes.ok) {
      return NextResponse.json(
        { isSuccess: false, message: result?.message ?? "Login failed" },
        { status: nestRes.status },
      );
    }

    const { accessToken, refreshToken, user } = result?.data;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { isSuccess: false, message: "Authentication failed" },
        { status: 500 },
      );
    }

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      isSuccess: true,
      message: result?.message,
      user,
    });
  } catch (err) {
    console.error("[/api/auth/login]", err);
    return NextResponse.json(
      { isSuccess: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
