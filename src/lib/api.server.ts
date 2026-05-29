import { getAccessToken, silentRefresh } from "./tokens.server";

const SERVER_API = process.env.NEXT_PUBLIC_API_LINK!;

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  ok: boolean;
  status: number;
}

/**
 * Server-side authenticated fetcher.
 * Safe to use across React Server Components (RSC), Server Actions, and Route Handlers.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { skipAuth = false, ...fetchOptions } = options;

  const incomingBody = fetchOptions.body;
  const isFormData = incomingBody instanceof FormData;

  const makeRequest = async (token: string | null) => {
    const headers: Record<string, string> = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(fetchOptions.headers as Record<string, string>),
    };

    let finalBody: BodyInit | null | undefined = incomingBody;

    if (isFormData) {
      // CRITICAL: Content-Type must remain undefined so fetch can insert the accurate multi-part boundary string
      delete headers["content-type"];
      delete headers["Content-Type"];
    } else {
      headers["Content-Type"] = "application/json";

      // If the body is already stringified JSON, unwrap it to clean up double escapes
      if (typeof incomingBody === "string") {
        try {
          const parsed = JSON.parse(incomingBody) as unknown;
          finalBody = JSON.stringify(parsed);
        } catch {
          finalBody = incomingBody;
        }
      } else if (incomingBody !== undefined && incomingBody !== null) {
        finalBody = JSON.stringify(incomingBody);
      }
    }

    const targetUrl =
      path.startsWith("http://") || path.startsWith("https://")
        ? path
        : `${SERVER_API}${path}`;

    return fetch(targetUrl, {
      ...fetchOptions,
      method: fetchOptions.method ?? "GET",
      headers,
      body: finalBody,
      cache: "no-store", // Keep data synchronized across server evaluations
    });
  };

  if (skipAuth) {
    const res = await makeRequest(null);
    const data = (await res.json().catch(() => null)) as T | null;
    return { data, ok: res.ok, status: res.status };
  }

  // Attempt 1: Execute with the active access token
  const accessToken = await getAccessToken();
  let res = await makeRequest(accessToken);

  // Attempt 2: If unauthorized (401), execute an internal silent refresh cycle once
  if (res.status === 401) {
    const refreshed = await silentRefresh();

    if (!refreshed) {
      console.warn(
        "[apiFetch] Session token recovery rejected. Token is completely expired.",
      );
      return { data: null, ok: false, status: 401 };
    }

    // Attempt 3: Retry request pipeline with the freshly rotated token
    const newToken = await getAccessToken();
    res = await makeRequest(newToken);
  }

  const data = (await res.json().catch(() => null)) as T | null;
  return { data, ok: res.ok, status: res.status };
}
