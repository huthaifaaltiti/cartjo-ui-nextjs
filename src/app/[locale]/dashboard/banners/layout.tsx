import BannersPageHeader from "@/components/admin/routes/banners/BannersPageHeader";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(DashboardModule.BANNERS);

  return (
    <div className="w-full h-full">
      <BannersPageHeader />
      {children}
    </div>
  );
}
