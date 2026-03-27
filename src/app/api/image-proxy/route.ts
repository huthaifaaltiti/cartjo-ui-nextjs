import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Without compressing
// export async function GET(req: NextRequest) {
//   const url = req.nextUrl.searchParams.get("url");

//   if (!url) {
//     return NextResponse.json({ error: "Missing url param" }, { status: 400 });
//   }

//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Failed to fetch image" },
//         { status: 502 },
//       );
//     }

//     const arrayBuffer = await response.arrayBuffer();
//     const inputBuffer = Buffer.from(arrayBuffer);
//     const contentType = response.headers.get("content-type") || "";

//     // react-pdf only supports png and jpg — convert everything else (e.g. webp) to png
//     const isSupported =
//       contentType.includes("image/png") || contentType.includes("image/jpeg");

//     let outputBuffer: Buffer;
//     let outputContentType: string;

//     if (isSupported) {
//       outputBuffer = inputBuffer;
//       outputContentType = contentType;
//     } else {
//       // Convert to PNG via sharp (handles webp, gif, avif, tiff, etc.)
//       outputBuffer = await sharp(inputBuffer).png().toBuffer();
//       outputContentType = "image/png";
//     }

//     const base64 = outputBuffer.toString("base64");

//     return NextResponse.json({ base64, contentType: outputContentType });
//   } catch (err) {
//     console.error("[image-proxy] error:", err);
//     return NextResponse.json({ error: "Image proxy failed" }, { status: 500 });
//   }
// }

const MAX_WIDTH = 220; // perfect for receipts
const JPEG_QUALITY = 70;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 502 },
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // resize + compress
    const optimizedBuffer = await sharp(inputBuffer)
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
      })
      .flatten({ background: "#ffffff" })
      .jpeg({
        quality: JPEG_QUALITY,
        mozjpeg: true,
      })
      .toBuffer();

    const base64 = optimizedBuffer.toString("base64");

    return NextResponse.json({
      base64,
      contentType: "image/jpeg",
    });
  } catch (err) {
    console.error("[image-proxy] error:", err);
    return NextResponse.json({ error: "Image proxy failed" }, { status: 500 });
  }
}
