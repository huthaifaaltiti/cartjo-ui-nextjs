// import { FetchError } from "@/types/common";

// /**
//  * General fetch wrapper
//  * @param url string | URL
//  * @param options RequestInit
//  * @returns Parsed JSON response
//  * @throws FetchError if response is not OK
//  */

import { FetchError } from "@/types/common";
import { handleAuthError } from "./auth/handleAuthError";

/**
 * General fetch wrapper
 * @param url string | URL
 * @param options RequestInit
 * @returns Parsed JSON response
 * @throws FetchError if response is not OK
 */
export async function fetcher<T>(
  url: string | URL,
  options?: RequestInit,
  skipAuthErrorHandling = false,
): Promise<T> {
  const resp = await fetch(url, options);

  // Handle expired token
  if (!skipAuthErrorHandling) {
    await handleAuthError(resp); // only runs for authenticated requests
  }

  const respObj = (await resp.json()) as T;

  if (!resp.ok) {
    const err: FetchError = new Error(
      (respObj as { message?: string })?.message || "Request failed",
    );
    err.status = resp.status;
    err.details = respObj;
    throw err;
  }

  return respObj;
}
