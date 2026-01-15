"use client";

import { usePathname } from "@/i18n/navigation";
import {
  // Bell,
  // CreditCard,
  // HandCoins,
  Heart,
  // MapPin,
  Power,
  // Settings,
  ShoppingBag,
  ShoppingCart,
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
  const pathname = usePathname();

  const userLayoutRoutesNavigator = {
    [UserRouteType.QUICK_ACTIONS]: [
      {
        icon: ShoppingBag,
        label: t(
          "routes.user.layout.components.UserQuickActions.quickActions.orders"
        ),
        path: "/user/orders",
      },
      {
        icon: Undo2,
        label: t(
          "routes.user.layout.components.UserQuickActions.quickActions.returns"
        ),
        path: "/user/returns",
      },
      {
        icon: Heart,
        label: t(
          "routes.user.layout.components.UserQuickActions.quickActions.wishlist"
        ),
        path: "/wishlist",
      },
      {
        icon: ShoppingCart,
        label: t(
          "routes.user.layout.components.UserQuickActions.quickActions.cart"
        ),
        path: "/cart",
      },
    ],
    [UserRouteType.USER_ACCOUNT]: [
      {
        icon: User,
        label: t("routes.user.layout.components.UserAccountMenu.items.profile"),
        path: "/user/profile",
      },
      // {
      //   icon: MapPin,
      //   label: t(
      //     "routes.user.layout.components.UserAccountMenu.items.addresses"
      //   ),
      //   path: "/user/account/addresses",
      // },
      // {
      //   icon: HandCoins,
      //   label: t(
      //     "routes.user.layout.components.UserAccountMenu.items.payments"
      //   ),
      //   path: "/user/account/payments",
      // },
      // {
      //   icon: CreditCard,
      //   label: t(
      //     "routes.user.layout.components.UserAccountMenu.items.digitalCards"
      //   ),
      //   path: "/user/account/digital-cards",
      // },
    ],
    [UserRouteType.OTHERS]: [
      // {
      //   icon: Bell,
      //   label: t(
      //     "routes.user.layout.components.UserOthersActions.items.notifications"
      //   ),
      //   path: "/user/notifications",
      // },
      // {
      //   icon: Settings,
      //   label: t(
      //     "routes.user.layout.components.UserOthersActions.items.securitySettings"
      //   ),
      //   path: "/user/security-settings",
      // },
    ],
    [UserRouteType.SIGNOUT]: [
      {
        icon: Power,
        label: t("routes.user.layout.components.UserLogout.label"),
        path: "#",
      },
    ],
  };

  const routesWithMatch = (userLayoutRoutesNavigator[type] ?? []).map(
    (item) => ({
      ...item,
      isContainsPathname: pathname.includes(item.path),
    })
  );

  return routesWithMatch;
}
