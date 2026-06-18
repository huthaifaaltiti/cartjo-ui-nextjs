import { getSession } from "@/lib/session.server";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  return NextResponse.json({
    session,
  });
}
