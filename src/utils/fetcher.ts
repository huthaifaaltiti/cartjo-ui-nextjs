import { FetchError } from "@/types/common";

/**
 * General fetch wrapper
 * @param url string | URL
 * @param options RequestInit
 * @returns Parsed JSON response
 * @throws FetchError if response is not OK
 */

export async function fetcher<T = any>(
  url: string | URL,
  options?: RequestInit
): Promise<T> {
  const resp = await fetch(url, options);

  let respObj: any = null;

  try {
    respObj = await resp.json();
  } catch (e) {
    // ignore JSON parse errors
  }

  if (!resp.ok) {
    const err: FetchError = new Error(respObj?.message || 'Request failed');
    err.status = resp.status;
    err.details = respObj;
    throw err;
  }

  return respObj as T;
}
