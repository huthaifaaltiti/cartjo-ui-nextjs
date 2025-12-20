// import { FetchError } from "@/types/common";

// /**
//  * General fetch wrapper
//  * @param url string | URL
//  * @param options RequestInit
//  * @returns Parsed JSON response
//  * @throws FetchError if response is not OK
//  */

// export async function fetcher<T = any>(
//   url: string | URL,
//   options?: RequestInit
//   // lang?: string | Locale
// ): Promise<T> {
//   const resp = await fetch(url, options);

//   // handleUnauthorizedResponse(resp, lang || "en");

//   let respObj: unknown = null;

//   respObj = await resp.json();

//   // try {
//   //   respObj = await resp.json();
//   // } catch (e: unknown) {
//   //   // ignore JSON parse errors
//   // }

//   if (!resp.ok) {
//     const err: FetchError = new Error(
//       (respObj as { message?: string })?.message || "Request failed"
//     );
//     err.status = resp.status;
//     err.details = respObj;
//     throw err;
//   }

//   return respObj as T;
// }

import { FetchError } from "@/types/common";

/**
 * General fetch wrapper
 * @param url string | URL
 * @param options RequestInit
 * @returns Parsed JSON response
 * @throws FetchError if response is not OK
 */
export async function fetcher<T>(
  url: string | URL,
  options?: RequestInit
): Promise<T> {
  const resp = await fetch(url, options);

  const respObj = (await resp.json()) as T;

  if (!resp.ok) {
    const err: FetchError = new Error(
      (respObj as { message?: string })?.message || "Request failed"
    );
    err.status = resp.status;
    err.details = respObj;
    throw err;
  }

  return respObj;
}
