import { DashboardModule } from "@/enums/dashboard-module.enum";
import { Permission } from "@/enums/permission.enum";

export const ROUTE_PERMISSIONS: Partial<
  Record<DashboardModule, Permission | Permission[]>
> = {
  [DashboardModule.USERS]: [
    Permission.USERS_READ,
    Permission.USERS_CREATE,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.USERS_RESTORE,
    Permission.USERS_ACTIVATE,
    Permission.USERS_DEACTIVATE,
  ],

  [DashboardModule.CATEGORIES]: [
    Permission.CATEGORIES_READ,
    Permission.CATEGORIES_CREATE,
    Permission.CATEGORIES_UPDATE,
    Permission.CATEGORIES_DELETE,
    Permission.CATEGORIES_ACTIVATE,
    Permission.CATEGORIES_DEACTIVATE,
  ],

  [DashboardModule.SUB_CATEGORIES]: [
    Permission.SUB_CATEGORIES_READ,
    Permission.SUB_CATEGORIES_CREATE,
    Permission.SUB_CATEGORIES_UPDATE,
    Permission.SUB_CATEGORIES_DELETE,
    Permission.SUB_CATEGORIES_ACTIVATE,
    Permission.SUB_CATEGORIES_DEACTIVATE,
  ],

  [DashboardModule.PRODUCTS]: [
    Permission.PRODUCTS_READ,
    Permission.PRODUCTS_CREATE,
    Permission.PRODUCTS_UPDATE,
    Permission.PRODUCTS_DELETE,
    Permission.PRODUCTS_ACTIVATE,
    Permission.PRODUCTS_DEACTIVATE,
  ],

  [DashboardModule.LOGOS]: [
    Permission.LOGOS_READ,
    Permission.LOGOS_CREATE,
    Permission.LOGOS_UPDATE,
    Permission.LOGOS_DELETE,
    Permission.LOGOS_ACTIVATE,
    Permission.LOGOS_DEACTIVATE,
  ],

  [DashboardModule.BANNERS]: [
    Permission.BANNERS_READ,
    Permission.BANNERS_CREATE,
    Permission.BANNERS_UPDATE,
    Permission.BANNERS_DELETE,
    Permission.BANNERS_ACTIVATE,
    Permission.BANNERS_DEACTIVATE,
  ],

  [DashboardModule.TYPE_HINT_CONFIGS]: [
    Permission.TYPE_HINT_CONFIGS_READ,
    Permission.TYPE_HINT_CONFIGS_CREATE,
    Permission.TYPE_HINT_CONFIGS_UPDATE,
    Permission.TYPE_HINT_CONFIGS_DELETE,
    Permission.TYPE_HINT_CONFIGS_ACTIVATE,
    Permission.TYPE_HINT_CONFIGS_DEACTIVATE,
  ],

  [DashboardModule.SHOWCASES]: [
    Permission.SHOWCASES_READ,
    Permission.SHOWCASES_CREATE,
    Permission.SHOWCASES_UPDATE,
    Permission.SHOWCASES_DELETE,
    Permission.SHOWCASES_ACTIVATE,
    Permission.SHOWCASES_DEACTIVATE,
  ],

  [DashboardModule.ORDERS]: [
    Permission.ORDERS_READ,
    Permission.ORDERS_CREATE,
    Permission.ORDERS_UPDATE,
    Permission.ORDERS_CANCEL,
    Permission.ORDERS_REFUND,
  ],
};
