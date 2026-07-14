import { DashboardModule } from "@/enums/dashboard-module.enum";
import { ROUTE_PERMISSIONS } from "@/config/route-permissions";
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
} from "lucide-react";

export const dashboardNavLinks = [
  {
    name: DashboardModule.USERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.users",
    href: "/dashboard/users",
    icon: Users,
    permissions: ROUTE_PERMISSIONS[DashboardModule.USERS],
  },
  {
    name: DashboardModule.CATEGORIES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.categories",
    href: "/dashboard/categories",
    icon: Box,
    permissions: ROUTE_PERMISSIONS[DashboardModule.CATEGORIES],
  },
  {
    name: DashboardModule.SUB_CATEGORIES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.subCategories",
    href: "/dashboard/sub-categories",
    icon: Boxes,
    permissions: ROUTE_PERMISSIONS[DashboardModule.SUB_CATEGORIES],
  },
  {
    name: DashboardModule.PRODUCTS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.products",
    href: "/dashboard/products",
    icon: ShoppingBasket,
    permissions: ROUTE_PERMISSIONS[DashboardModule.PRODUCTS],
  },
  {
    name: DashboardModule.LOGOS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.logo",
    href: "/dashboard/logos",
    icon: Feather,
    permissions: ROUTE_PERMISSIONS[DashboardModule.LOGOS],
  },
  {
    name: DashboardModule.BANNERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.banner",
    href: "/dashboard/banners",
    icon: Flag,
    permissions: ROUTE_PERMISSIONS[DashboardModule.BANNERS],
  },
  {
    name: DashboardModule.TYPE_HINT_CONFIGS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.typeHintConfigs",
    href: "/dashboard/type-hint-configs",
    icon: Cog,
    permissions: ROUTE_PERMISSIONS[DashboardModule.TYPE_HINT_CONFIGS],
  },
  {
    name: DashboardModule.SHOWCASES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.showcases",
    href: "/dashboard/showcases",
    icon: LayoutPanelTop,
    permissions: ROUTE_PERMISSIONS[DashboardModule.SHOWCASES],
  },
  {
    name: DashboardModule.ORDERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.orders",
    href: "/dashboard/orders",
    icon: ListOrdered,
    permissions: ROUTE_PERMISSIONS[DashboardModule.ORDERS],
  },
];
