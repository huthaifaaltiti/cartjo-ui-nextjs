import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import InfoCard from "@/components/shared/InfoCard";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import UserLogout from "@/components/user/user/layout/UserLogout";
import UserAccountMenu from "@/components/user/user/layout/user-account/UserAccountMenu";
import UserInfoRow from "@/components/user/user/layout/user-info/UserInfoRow";
import UserOthersActions from "@/components/user/user/layout/user-others/UserOthersActions";
import UserQuickActions from "@/components/user/user/layout/user-quick-actions/UserQuickActions";
import { Locale } from "@/types/locale";

export default async function UserPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params:  Promise<{ locale: Locale | string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar />
      <MaxWidthWrapper className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col md:flex-row gap-6 py-6 items-stretch">
          <aside className="w-full md:w-80 flex-shrink-0 self-stretch">
            <div className="h-full flex flex-col gap-4">
              <InfoCard>
                <UserInfoRow />
              </InfoCard>
              <UserQuickActions />
              <UserAccountMenu />
              <UserOthersActions />
              <InfoCard>
                <UserLogout />
              </InfoCard>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="rounded-lg shadow-none">{children}</div>
          </main>
        </div>
      </MaxWidthWrapper>
      <Footer locale={locale as Locale} />
    </div>
  );
}
