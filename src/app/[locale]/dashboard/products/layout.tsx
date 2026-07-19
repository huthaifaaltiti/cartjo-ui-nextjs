import ProductsPageHeader from "@/components/admin/routes/products/ProductsPageHeader";
import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_PRODUCTS);

  return (
    <div className="w-full h-full">
      <ProductsPageHeader />
      {children}
    </div>
  );
}
