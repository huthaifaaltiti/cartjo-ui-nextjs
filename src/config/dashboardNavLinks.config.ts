import { DashboardModule } from "@/enums/dashboard-module.enum";
import { Permission } from "@/enums/permission.enum";
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
    permissions: [
      Permission.USERS_ACTIVATE,
      Permission.USERS_CREATE,
      Permission.USERS_DEACTIVATE,
      Permission.USERS_DELETE,
      Permission.USERS_READ,
      Permission.USERS_UPDATE,
    ],
  },
  {
    name: DashboardModule.CATEGORIES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.categories",
    href: "/dashboard/categories",
    icon: Box,
    permissions: [
      Permission.CATEGORIES_READ,
      Permission.CATEGORIES_CREATE,
      Permission.CATEGORIES_UPDATE,
      Permission.CATEGORIES_DELETE,
      Permission.CATEGORIES_ACTIVATE,
      Permission.CATEGORIES_DEACTIVATE,
    ],
  },
  {
    name: DashboardModule.SUB_CATEGORIES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.subCategories",
    href: "/dashboard/sub-categories",
    icon: Boxes,
    permissions: [
      Permission.SUB_CATEGORIES_READ,
      Permission.SUB_CATEGORIES_CREATE,
      Permission.SUB_CATEGORIES_UPDATE,
      Permission.SUB_CATEGORIES_DELETE,
      Permission.SUB_CATEGORIES_ACTIVATE,
      Permission.SUB_CATEGORIES_DEACTIVATE,
    ],
  },
  {
    name: DashboardModule.PRODUCTS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.products",
    href: "/dashboard/products",
    icon: ShoppingBasket,
    permissions: [
      Permission.PRODUCTS_READ,
      Permission.PRODUCTS_CREATE,
      Permission.PRODUCTS_UPDATE,
      Permission.PRODUCTS_DELETE,
      Permission.PRODUCTS_ACTIVATE,
      Permission.PRODUCTS_DEACTIVATE,
    ],
  },
  {
    name: DashboardModule.LOGOS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.logo",
    href: "/dashboard/logos",
    icon: Feather,
    permissions: [
      Permission.LOGOS_READ,
      Permission.LOGOS_CREATE,
      Permission.LOGOS_UPDATE,
      Permission.LOGOS_DELETE,
      Permission.LOGOS_ACTIVATE,
      Permission.LOGOS_DEACTIVATE,
    ],
  },
  {
    name: DashboardModule.BANNERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.banner",
    href: "/dashboard/banners",
    icon: Flag,
    permissions: [
      Permission.BANNERS_READ,
      Permission.BANNERS_CREATE,
      Permission.BANNERS_UPDATE,
      Permission.BANNERS_DELETE,
      Permission.BANNERS_ACTIVATE,
      Permission.BANNERS_DEACTIVATE,
    ],
  },
  {
    name: DashboardModule.TYPE_HINT_CONFIGS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.typeHintConfigs",
    href: "/dashboard/type-hint-configs",
    icon: Cog,
    permissions: [
      Permission.TYPE_HINT_CONFIGS_READ,
      Permission.TYPE_HINT_CONFIGS_CREATE,
      Permission.TYPE_HINT_CONFIGS_UPDATE,
      Permission.TYPE_HINT_CONFIGS_DELETE,
      Permission.TYPE_HINT_CONFIGS_ACTIVATE,
      Permission.TYPE_HINT_CONFIGS_DEACTIVATE,
    ],
  },
  {
    name: DashboardModule.SHOWCASES,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.showcases",
    href: "/dashboard/showcases",
    icon: LayoutPanelTop,
    permissions: [
      Permission.SHOWCASES_READ,
      Permission.SHOWCASES_CREATE,
      Permission.SHOWCASES_UPDATE,
      Permission.SHOWCASES_DELETE,
      Permission.SHOWCASES_ACTIVATE,
      Permission.SHOWCASES_DEACTIVATE,
    ],
  },
  {
    name: DashboardModule.ORDERS,
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.orders",
    href: "/dashboard/orders",
    icon: ListOrdered,
    permissions: [
      Permission.ORDERS_READ,
      Permission.ORDERS_CREATE,
      Permission.ORDERS_UPDATE,
      Permission.ORDERS_CANCEL,
      Permission.ORDERS_REFUND,
    ],
  },
];
