import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/tokens.server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken } = await req.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { isSuccess: false, message: "Missing tokens" },
        { status: 400 },
      );
    }

    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({ isSuccess: true });
  } catch {
    return NextResponse.json(
      { isSuccess: false, message: "Failed to store session" },
      { status: 500 },
    );
  }
}
