import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  // Check for secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret key" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    // Revalidate by tag
    if (body.tag) {
      revalidateTag(body.tag);

      console.log("revalidate tag");
      return NextResponse.json({
        revalidated: true,
        tag: body.tag,
        now: Date.now(),
      });
    }

    // Revalidate specific paths
    if (body.paths && Array.isArray(body.paths)) {
      body.paths.forEach((path: string) => {
        revalidatePath(path);
      });
      return NextResponse.json({
        revalidated: true,
        paths: body.paths,
        now: Date.now(),
      });
    }

    // Default: revalidate all pages
    revalidatePath("/", "layout");
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}
