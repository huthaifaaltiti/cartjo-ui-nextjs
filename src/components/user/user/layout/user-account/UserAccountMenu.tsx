import { memo } from "react";
import UserLayoutSection from "../UserLayoutSection";
import { useTranslations } from "next-intl";
import {
  UserRouteType,
  useUserLayoutRoutesNavigator,
} from "@/hooks/useUserLayoutRoutesNavigator";

const UserAccountMenu = () => {
  const t = useTranslations();
  const items = useUserLayoutRoutesNavigator(UserRouteType.USER_ACCOUNT);

  return (
    <UserLayoutSection
      header={t("routes.user.layout.components.UserAccountMenu.header")}
      items={items}
    />
  );
};
export default memo(UserAccountMenu);
