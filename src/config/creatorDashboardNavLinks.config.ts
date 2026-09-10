import { AppRoute } from "@/enums/app-route.enum";
import { Store } from "lucide-react";
import { ROUTE_PERMISSIONS } from "./route-permissions";

export const creatorDashboardNavLinks = [
  {
    name: AppRoute.CREATORS_DASHBOARD_STORE,
    labelKey: "routes.creators.routes.dashboard.layout.myStore",
    href: "/creators/dashboard/store",
    icon: Store,
    permissions: ROUTE_PERMISSIONS[AppRoute.CREATORS_DASHBOARD_STORE],
    isCompleted: true,
  },
  {
    name: AppRoute.CREATORS_DASHBOARD_STORE,
    labelKey: "routes.creators.routes.dashboard.layout.analytics",
    href: "/creators/dashboard/store",
    icon: Store,
    permissions: [],
    isCompleted: false,
  },
  {
    name: AppRoute.CREATORS_DASHBOARD_STORE,
    labelKey: "routes.creators.routes.dashboard.layout.profileSettings",
    href: "/creators/dashboard/store",
    icon: Store,
    permissions: [],
    isCompleted: false,
  },
];
