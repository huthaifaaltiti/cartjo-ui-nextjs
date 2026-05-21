import { fetcher } from "./fetcher";

/**
 * authFetcher — authenticated version of the existing fetcher.
 *
 * Routes through /api/proxy (Next.js route handler) which reads the
 * cartjo_access HttpOnly cookie server-side and attaches Bearer to NestJS.
 */
export async function authFetcher<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return fetcher<T>(
    "/api/proxy",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        method: options.method ?? "GET",
        body: options.body ? JSON.parse(options.body as string) : undefined,
        headers: options.headers ?? {},
      }),
    },
    true, // skipAuthErrorHandling — /api/proxy handles 401/refresh itself
  );
}