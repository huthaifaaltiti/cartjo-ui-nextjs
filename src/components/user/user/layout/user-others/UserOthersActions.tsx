import { memo } from "react";
import { useTranslations } from "next-intl";
import { Bell, Settings } from "lucide-react";
import UserLayoutSection, { UserLayoutSectionItem } from "../UserLayoutSection";

const UserOthersActions = () => {
  const t = useTranslations();

  const quickActions: UserLayoutSectionItem[] = [
    {
      icon: Bell,
      label: t(
        "routes.user.layout.components.UserOthersActions.items.notifications"
      ),
      path: "/notifications",
    },
    {
      icon: Settings,
      label: t(
        "routes.user.layout.components.UserOthersActions.items.securitySettings"
      ),
      path: "/security-settings",
    },
  ];

  return (
    <UserLayoutSection
      header={t("routes.user.layout.components.UserOthersActions.header")}
      items={quickActions}
    />
  );
};

export default memo(UserOthersActions);
