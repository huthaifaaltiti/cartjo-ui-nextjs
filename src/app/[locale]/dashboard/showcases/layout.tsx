import ShowcasesPageHeader from "@/components/admin/routes/showcases/ShowcasesPageHeader";
import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_SHOWCASES);

  return (
    <div className="w-full h-full">
      <ShowcasesPageHeader />
      {children}
    </div>
  );
}
