import {
  MapPin,
  Users,
  Box,
  Boxes,
  ShoppingBasket,
  FileMusic,
} from "lucide-react";

export const dashboardNavLinks = [
  {
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.locations",
    href: "/dashboard/locations",
    icon: MapPin,
  },
  {
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.categories",
    href: "/dashboard/categories",
    icon: Box,
  },
  {
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.subCategories",
    href: "/dashboard/sub-categories",
    icon: Boxes,
  },
  {
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.products",
    href: "/dashboard/products",
    icon: ShoppingBasket,
  },
  {
    labelKey:
      "routes.dashboard.components.DashboardControlNavLinks.navItems.media",
    href: "/dashboard/media",
    icon: FileMusic,
  },
];
