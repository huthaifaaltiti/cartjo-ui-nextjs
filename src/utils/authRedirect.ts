import { showSuccessToast } from "@/components/shared/CustomToast";
import { redirect } from "next/navigation";

export function requireAuth(
  accessToken: string | undefined | null,
  redirectTo: string = "/auth",
) {
  if (!accessToken) {
    showSuccessToast({
      title: 't("general.toast.title.success")',
      description: "response.message",
      dismissText: 't("general.toast.dismissText")',
    });

    redirect(redirectTo);
  }
}
