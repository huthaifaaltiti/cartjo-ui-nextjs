import CategoriesPageHeader from "@/components/admin/routes/categories/CategoriesPageHeader";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(DashboardModule.CATEGORIES);

  return (
    <div className="w-full h-full">
      <CategoriesPageHeader />
      {children}
    </div>
  );
}
