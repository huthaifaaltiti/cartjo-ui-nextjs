import { memo } from "react";
import { useTranslations } from "next-intl";
import { Heart, ShoppingBag, Undo2 } from "lucide-react";
import UserLayoutSection, { UserLayoutSectionItem } from "../UserLayoutSection";

const UserQuickActions = () => {
  const t = useTranslations();

  const quickActions: UserLayoutSectionItem[] = [
    {
      icon: ShoppingBag,
      label: t(
        "routes.user.layout.components.UserQuickActions.quickActions.orders"
      ),
      path: "/orders",
    },
    {
      icon: Undo2,
      label: t(
        "routes.user.layout.components.UserQuickActions.quickActions.returns"
      ),
      path: "/returns",
    },
    {
      icon: Heart,
      label: t(
        "routes.user.layout.components.UserQuickActions.quickActions.wishlist"
      ),
      path: "/wishlist",
    },
  ];

  return <UserLayoutSection items={quickActions} />;
};

export default memo(UserQuickActions);
