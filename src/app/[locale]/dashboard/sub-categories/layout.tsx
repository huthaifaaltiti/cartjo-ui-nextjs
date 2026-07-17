import SubCategoriesPageHeader from "@/components/admin/routes/subCategories/SubCategoriesPageHeader";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(DashboardModule.SUB_CATEGORIES);

  return (
    <div className="w-full h-full">
      <SubCategoriesPageHeader />
      {children}
    </div>
  );
}
