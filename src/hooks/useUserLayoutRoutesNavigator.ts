import {
  Bell,
  CreditCard,
  HandCoins,
  Heart,
  MapPin,
  Power,
  Settings,
  ShoppingBag,
  Undo2,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

export enum UserRouteType {
  QUICK_ACTIONS = "QUICK_ACTIONS",
  USER_ACCOUNT = "USER_ACCOUNT",
  OTHERS = "OTHERS",
  SIGNOUT = "SIGNOUT",
}

export function useUserLayoutRoutesNavigator(type: UserRouteType) {
  const t = useTranslations();

  const userLayoutRoutesNavigator = {
    [UserRouteType.QUICK_ACTIONS]: [
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
    ],
    [UserRouteType.USER_ACCOUNT]: [
      {
        icon: User,
        label: t("routes.user.layout.components.UserAccountMenu.items.profile"),
        path: "/account/profile",
      },
      {
        icon: MapPin,
        label: t(
          "routes.user.layout.components.UserAccountMenu.items.addresses"
        ),
        path: "/account/addresses",
      },
      {
        icon: HandCoins,
        label: t(
          "routes.user.layout.components.UserAccountMenu.items.payments"
        ),
        path: "/account/payments",
      },
      {
        icon: CreditCard,
        label: t(
          "routes.user.layout.components.UserAccountMenu.items.digitalCards"
        ),
        path: "/account/digital-cards",
      },
    ],
    [UserRouteType.OTHERS]: [
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
    ],
    [UserRouteType.SIGNOUT]: [
      {
        icon: Power,
        label: t("routes.user.layout.components.UserLogout.label"),
        path: "/logout",
      },
    ],
  };

  return userLayoutRoutesNavigator[type] ?? [];
}
