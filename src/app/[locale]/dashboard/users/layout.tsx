import UsersPageHeader from "@/components/admin/routes/users/UsersPageHeader";
import { AppRoute } from "@/enums/app-route.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(AppRoute.DASHBOARD_USERS);

  return (
    <div className="w-full h-full">
      <UsersPageHeader />
      {children}
    </div>
  );
}
