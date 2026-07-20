import SubCategoriesPageHeader from "@/components/admin/routes/subCategories/SubCategoriesPageHeader";
import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_SUB_CATEGORIES);

  return (
    <div className="w-full h-full">
      <SubCategoriesPageHeader />
      {children}
    </div>
  );
}
