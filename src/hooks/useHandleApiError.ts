import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { showErrorToast } from "@/components/shared/CustomToast";
import { Locale } from "@/enums/locale.enum";

const handleLogout = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lang: Locale.EN,
    }),
  });
};

export const useHandleApiError = () => {
  const router = useRouter();
  const t = useTranslations();

  const handleApiError = async (error: Error) => {
    if (!error) return;

    showErrorToast({
      title: t("general.toast.title.error"),
      description: error.message,
      dismissText: t("general.toast.dismissText"),
    });

    if (error.message === "Unauthorized") {
      await handleLogout();
      router.push("/auth");
      return;
    }

    return error;
  };

  return handleApiError;
};
