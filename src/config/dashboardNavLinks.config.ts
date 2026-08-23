import { ROUTE_PERMISSIONS } from "@/config/route-permissions";
import { AppRoute } from "@/enums/app-route.enum";
import {
  Users,
  Box,
  Boxes,
  ShoppingBasket,
  Feather,
  Flag,
  LayoutPanelTop,
  Cog,
  ListOrdered,
  Sparkles,
} from "lucide-react";

export const dashboardNavLinks = [
  {
    name: AppRoute.DASHBOARD_USERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.users",
    href: "/dashboard/users",
    icon: Users,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_USERS],
  },
  {
    name: AppRoute.DASHBOARD_CATEGORIES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.categories",
    href: "/dashboard/categories",
    icon: Box,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_CATEGORIES],
  },
  {
    name: AppRoute.DASHBOARD_SUB_CATEGORIES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.subCategories",
    href: "/dashboard/sub-categories",
    icon: Boxes,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_SUB_CATEGORIES],
  },
  {
    name: AppRoute.DASHBOARD_PRODUCTS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.products",
    href: "/dashboard/products",
    icon: ShoppingBasket,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_PRODUCTS],
  },
  {
    name: AppRoute.DASHBOARD_LOGOS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.logo",
    href: "/dashboard/logos",
    icon: Feather,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_LOGOS],
  },
  {
    name: AppRoute.DASHBOARD_BANNERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.banner",
    href: "/dashboard/banners",
    icon: Flag,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_BANNERS],
  },
  {
    name: AppRoute.DASHBOARD_TYPE_HINT_CONFIGS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.typeHintConfigs",
    href: "/dashboard/type-hint-configs",
    icon: Cog,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_TYPE_HINT_CONFIGS],
  },
  {
    name: AppRoute.DASHBOARD_SHOWCASES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.showcases",
    href: "/dashboard/showcases",
    icon: LayoutPanelTop,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_SHOWCASES],
  },
  {
    name: AppRoute.DASHBOARD_ORDERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.orders",
    href: "/dashboard/orders",
    icon: ListOrdered,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_ORDERS],
  },
  {
    name: AppRoute.DASHBOARD_CREATORS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.creators",
    href: "/dashboard/creators",
    icon: Sparkles,
    permissions: ROUTE_PERMISSIONS[AppRoute.DASHBOARD_CREATORS],
  },
];
