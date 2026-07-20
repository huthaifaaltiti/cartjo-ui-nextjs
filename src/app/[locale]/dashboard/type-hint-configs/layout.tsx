import TypeHintConfigsPageHeader from "@/components/admin/routes/typeHintConfigs/TypeHintConfigsPageHeader";
import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_TYPE_HINT_CONFIGS);

  return (
    <div className="w-full h-full">
      <TypeHintConfigsPageHeader />
      {children}
    </div>
  );
}
