import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  getRefreshToken,
  silentRefresh,
} from "@/lib/tokens.server";
import { TOKEN_KEYS } from "@/constants/tokenKeys.constants";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");

    let path: string;
    let method: string;
    let extraHeaders: Record<string, string> = {};
    let finalBody: any;

    if (isMultipart) {
      // 1. Read metadata out of transport headers
      path = req.headers.get("x-proxy-path") || "";
      method = req.headers.get("x-proxy-method") || "POST";

      try {
        const rawHeaders = req.headers.get("x-proxy-headers");
        extraHeaders = rawHeaders ? JSON.parse(rawHeaders) : {};
      } catch {
        extraHeaders = {};
      }

      // Safeguard: strip system headers to prevent conflicts downstream
      delete extraHeaders["content-type"];

      // 2. Safely parse the raw multipart payload incoming into Next.js
      const incomingFormData = await req.formData();
      const outboundFormData = new FormData();

      // Reconstruct the payload to forward downstream safely
      incomingFormData.forEach((value, key) => {
        outboundFormData.append(key, value);
      });

      finalBody = outboundFormData;
    } else {
      // JSON Payload Fallback Path
      const payload = await req.json();
      path = payload.path;
      method = payload.method || "POST";
      extraHeaders = payload.headers || {};
      finalBody =
        payload.body !== undefined ? JSON.stringify(payload.body) : undefined;
    }

    const SERVER_API = process.env.NEXT_PUBLIC_API_LINK!;
    const daysNum = Number(process.env.JWT_REFRESH_EXPIRATION_TIME_DAYS ?? 7);
    const minutesNum = Number(
      process.env.JWT_MIN_EXPIRATION_TIME_MINUTES ?? 15,
    );

    const targetUrl =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${SERVER_API}${path}`;

    const accessToken =
      req.cookies.get(TOKEN_KEYS.ACCESS_TOKEN)?.value ??
      (await getAccessToken());

    const refreshToken =
      req.cookies.get(TOKEN_KEYS.REFRESH_TOKEN)?.value ??
      (await getRefreshToken());

    const makeRequest = async (token: string | null) => {
      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
      };

      // CRITICAL: Let fetch auto-generate the content-type with the correct boundary string
      if (!isMultipart) {
        headers["Content-Type"] = "application/json";
      }

      return fetch(targetUrl, {
        method: method,
        headers,
        body: finalBody,
        cache: "no-store",
      });
    };

    let nestRes = await makeRequest(accessToken);

    if (nestRes.status === 401 && refreshToken) {
      const refreshed = await silentRefresh();

      if (refreshed) {
        const newToken = await getAccessToken();
        nestRes = await makeRequest(newToken);

        const data = await nestRes.json();
        const response = NextResponse.json(data, { status: nestRes.status });

        const cookieStore = await cookies();
        const newAccess = cookieStore.get(TOKEN_KEYS.ACCESS_TOKEN);
        const newRefresh = cookieStore.get(TOKEN_KEYS.REFRESH_TOKEN);

        if (newAccess) {
          response.cookies.set(TOKEN_KEYS.ACCESS_TOKEN, newAccess.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * minutesNum, // minutes
          });
        }
        if (newRefresh) {
          response.cookies.set(TOKEN_KEYS.REFRESH_TOKEN, newRefresh.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * daysNum, // days
          });
        }

        return response;
      } else {
        // Refresh failed — session is truly expired
        console.log("[proxy] refresh failed, session expired");
        return NextResponse.json(
          {
            isSuccess: false,
            message: "Session expired. Please log in again.",
          },
          { status: 401 },
        );
      }
    }

    // ── Safe JSON parse ─────────────────────────────────────────────
    const text = await nestRes.text();
    console.log("[proxy] NestJS raw response:", text.slice(0, 200));

    if (!text) {
      return NextResponse.json({}, { status: nestRes.status });
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { isSuccess: false, message: `Server error: ${text.slice(0, 150)}` },
        { status: nestRes.status },
      );
    }

    return NextResponse.json(data, { status: nestRes.status });
  } catch (err) {
    console.error("[/api/proxy] error:", err);
    return NextResponse.json(
      { isSuccess: false, message: "Proxy error. Check server logs." },
      { status: 500 },
    );
  }
}
