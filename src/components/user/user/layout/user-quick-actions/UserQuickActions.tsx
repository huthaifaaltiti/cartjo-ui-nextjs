import { memo } from "react";
import UserLayoutSection from "../UserLayoutSection";
import {
  UserRouteType,
  useUserLayoutRoutesNavigator,
} from "@/hooks/useUserLayoutRoutesNavigator";

const UserQuickActions = () => {
  const items = useUserLayoutRoutesNavigator(UserRouteType.QUICK_ACTIONS);

  return <UserLayoutSection items={items} />;
};

export default memo(UserQuickActions);
