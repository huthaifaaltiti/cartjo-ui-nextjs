import { redirect } from "next/navigation";

export function requireAuth(
  accessToken: string | undefined,
  redirectTo: string = "/auth"
) {
  if (!accessToken) {
    redirect(redirectTo);
  }
}
