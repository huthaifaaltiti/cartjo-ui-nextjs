import { showWarningToast } from "@/components/shared/CustomToast";
import { useTranslations } from "next-intl";

export const showNoPermissionToast = (
  t: ReturnType<typeof useTranslations>,
) => {
  showWarningToast({
    title: t("general.toast.title.error"),
    description: t("general.authorization.noPermission"),
    dismissText: t("general.toast.dismissText"),
  });
};
