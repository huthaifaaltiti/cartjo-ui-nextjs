import { TOKEN_KEYS } from "@/constants/tokenKeys.constants";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "./apiEndpoints";

const daysNum = Number(process.env.JWT_REFRESH_EXPIRATION_TIME_DAYS ?? 7);
const minutesNum = Number(process.env.JWT_MIN_EXPIRATION_TIME_MINUTES ?? 15);

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NEXT_PUBLIC_ENV_TYPE === "production",
  sameSite: "strict" as const,
  path: "/",
};

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken, {
    ...COOKIE_BASE,
    maxAge: 60 * minutesNum, // 15 min
  });
  cookieStore.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken, {
    ...COOKIE_BASE,
    maxAge: 60 * 60 * 24 * daysNum, // 7 days
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEYS.ACCESS_TOKEN);
  cookieStore.delete(TOKEN_KEYS.REFRESH_TOKEN);
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEYS.ACCESS_TOKEN)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEYS.REFRESH_TOKEN)?.value ?? null;
}

export async function silentRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    console.log("[silentRefresh] no refresh token in cookies");
    return false;
  }

  try {
    const url = API_ENDPOINTS.AUTH.REFRESH;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    console.log("[silentRefresh] response status:", res.status);

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        "[silentRefresh] failed:",
        res.status,
        errText.slice(0, 200),
      );

      // Only clear cookies on explicit auth rejection
      if (res.status === 401 || res.status === 403) {
        await clearAuthCookies();
      }
      return false;
    }

    const result = await res.json();

    console.log("[silentRefresh] response keys:", Object.keys(result));

    // Handle both { accessToken, refreshToken } and { data: { accessToken, refreshToken } }
    const newAccessToken = result.accessToken ?? result.data?.accessToken;
    const newRefreshToken = result.refreshToken ?? result.data?.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
      console.error(
        "[silentRefresh] unexpected response shape:",
        JSON.stringify(result).slice(0, 200),
      );
      return false;
    }

    await setAuthCookies(newAccessToken, newRefreshToken);
    console.log("[silentRefresh] ✅ tokens rotated successfully");
    return true;
  } catch (err) {
    // Network error — do NOT clear cookies
    console.error("[silentRefresh] network error:", err);
    return false;
  }
}
