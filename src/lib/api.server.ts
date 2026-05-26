import { getAccessToken, silentRefresh } from "./tokens.server";

const SERVER_API = process.env.NEXT_PUBLIC_API_LINK!;

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

// Server-side authenticated fetch
// Use this in Server Components and Route Handlers
export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {},
): Promise<{ data: T; ok: boolean; status: number }> {
  const { skipAuth = false, ...fetchOptions } = options;

  const makeRequest = async (token: string | null) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    };

    const targetUrl =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${SERVER_API}${path}`;

    return fetch(targetUrl, {
      ...fetchOptions,
      headers,
      cache: "no-store", // always fresh for auth-related
    });
  };

  if (skipAuth) {
    const res = await makeRequest(null);
    const data = await res.json();
    return { data, ok: res.ok, status: res.status };
  }

  // First attempt with current access token
  const accessToken = await getAccessToken();
  let res = await makeRequest(accessToken);

  // 401 → try silent refresh once
  if (res.status === 401) {
    const refreshed = await silentRefresh();

    if (!refreshed) {
      return { data: null as any, ok: false, status: 401 };
    }

    // Retry with new access token
    const newToken = await getAccessToken();
    res = await makeRequest(newToken);
  }

  const data = await res.json().catch(() => null);
  return { data, ok: res.ok, status: res.status };
}
