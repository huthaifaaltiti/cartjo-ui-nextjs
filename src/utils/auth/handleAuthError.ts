import { signOut, getSession } from "next-auth/react";

export async function handleAuthError(response: Response) {
  if (response.status === 401) {
    const session = await getSession();

    if (session) {
      // Only sign out if user WAS logged in (expired token)
      await signOut();
    }
    throw new Error("Unauthorized");
  }

  return response;
}
