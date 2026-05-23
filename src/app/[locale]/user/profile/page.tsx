import { getQueryClient } from "@/utils/queryUtils";
import UserProfileHeader from "@/components/user/user/routes/profile/UserProfileHeader";
import { Locale } from "@/types/locale";
import UserProfileContent from "@/components/user/user/routes/profile/UserProfileContent";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/tokens.server";
import { getSession } from "@/lib/session.server";
import { CartJOSession } from "@/types/cartjoSession.type";
import { getStaticNationalityListQueryOptions } from "@/hooks/react-query/query-options/staticNationalityList";
import { getUserProfileQueryOptions } from "@/hooks/react-query/query-options/userProfile";
import { requireAuth } from "@/utils/authRedirect";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const UserProfilePage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const token = await getAccessToken();
  requireAuth(token);
  const session = (await getSession()) as CartJOSession | null;

  const queryClient = getQueryClient();

  if (session?.id && token) {
    await queryClient.prefetchQuery(
      getUserProfileQueryOptions(locale, session?.id, token),
    );
  }
  if (token) {
    await queryClient.prefetchQuery(
      getStaticNationalityListQueryOptions(locale, token),
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="w-full flex flex-col gap-4">
      <HydrationBoundary state={dehydratedState}>
        <UserProfileHeader />
        <UserProfileContent userId={session?.id} />
      </HydrationBoundary>
    </div>
  );
};

export default UserProfilePage;
