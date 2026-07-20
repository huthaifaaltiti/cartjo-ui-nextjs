import { fetcher } from "./fetcher";

export async function authFetcher<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const body = options.body;
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) ?? {}),
  };

  let finalBody: BodyInit;

  if (isFormData) {
    // Inject proxy routing configuration details into custom transport headers
    headers["x-proxy-path"] = path;
    headers["x-proxy-method"] = options.method ?? "POST";
    headers["x-proxy-headers"] = JSON.stringify(options.headers ?? {});
    // NOTE: Leave Content-Type completely undefined here.
    // The browser will automatically set 'multipart/form-data' along with the accurate boundary.

    finalBody = body as FormData;
  } else {
    headers["Content-Type"] = "application/json";

    let parsedPayload: unknown = body;

    if (typeof body === "string") {
      try {
        parsedPayload = JSON.parse(body) as unknown;
      } catch {
        parsedPayload = body;
      }
    }

    finalBody = JSON.stringify({
      path,
      method: options.method ?? "GET",
      body: parsedPayload,
      headers: options.headers ?? {},
    });
  }

  try {
    return await fetcher<T>(
      "/api/proxy",
      {
        method: "POST",
        headers,
        body: finalBody,
      },
      true, // skipAuthErrorHandling => /api/proxy handles token refresh lifecycle itself
    );
  } catch (error: unknown) {
    const err = error as { status?: number };

    if (typeof window !== "undefined" && err?.status === 403) {
      window.location.replace("/403");
    }

    throw error;
  }
}
