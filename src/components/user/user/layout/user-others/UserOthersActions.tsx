import { memo } from "react";
import { useTranslations } from "next-intl";
import UserLayoutSection from "../UserLayoutSection";
import {
  UserRouteType,
  useUserLayoutRoutesNavigator,
} from "@/hooks/useUserLayoutRoutesNavigator";

const UserOthersActions = () => {
  const t = useTranslations();
  const items = useUserLayoutRoutesNavigator(UserRouteType.OTHERS);

  return (
    <UserLayoutSection
      header={t("routes.user.layout.components.UserOthersActions.header")}
      items={items}
    />
  );
};

export default memo(UserOthersActions);
