import { signOut } from "next-auth/react";

export async function handleAuthError(response: Response) {
  if (response.status === 401) {
    await signOut();
    throw new Error("Unauthorized");
  }

  return response;
}