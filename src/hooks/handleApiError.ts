import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { showErrorToast } from "@/components/shared/CustomToast";

export const useHandleApiError = () => {
  // const router = useRouter();
  const t = useTranslations();

  const handleApiError = (error: Error) => {
    showErrorToast({
      title: t("general.toast.title.error"),
      description: error.message,
      dismissText: t("general.toast.dismissText"),
    });

    if (error.message === "Unauthorized") {
      signOut({ redirect: true });
      // router.push("/auth");
      return;
    }

    return error;
  };

  return handleApiError;
};
