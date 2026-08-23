import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_CREATORS);

  return <div className="w-full h-full">{children}</div>;
}
