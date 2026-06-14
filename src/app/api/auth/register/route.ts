import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { setAuthCookies } from "@/lib/tokens.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const nestRes = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const result = await nestRes.json();

  if (!nestRes.ok) {
    return NextResponse.json(
      { isSuccess: false, message: result.message },
      { status: nestRes.status },
    );
  }

  const { accessToken, refreshToken, user } = result;

  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({
    isSuccess: true,
    message: result.message,
    user,
  });
}
