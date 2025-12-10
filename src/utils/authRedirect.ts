import { redirect } from "next/navigation";

export function requireAuth(
  accessToken: string | undefined | null,
  redirectTo: string = "/auth"
) {
  if (!accessToken) {
    redirect(redirectTo);
  }
}
