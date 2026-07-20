import OrdersPageHeader from "@/components/admin/routes/orders/OrdersPageHeader";
import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_ORDERS);

  return (
    <div className="w-full h-full">
      <OrdersPageHeader />
      {children}
    </div>
  );
}
