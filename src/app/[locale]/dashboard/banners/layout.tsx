import BannersPageHeader from "@/components/admin/routes/banners/BannersPageHeader";
import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_BANNERS);

  return (
    <div className="w-full h-full">
      <BannersPageHeader />
      {children}
    </div>
  );
}
