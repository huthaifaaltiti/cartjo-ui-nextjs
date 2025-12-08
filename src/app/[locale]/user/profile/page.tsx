import { getQueryClient } from "@/utils/queryUtils";
import UserProfileHeader from "@/components/user/user/routes/profile/UserProfileHeader";
import { getStaticNationalityListQueryOptions, getUserProfileQueryOptions } from "@/utils/queryOptions";
import { Locale } from "@/types/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ExtendedSession } from "@/types/session";
import UserProfileContent from "@/components/user/user/routes/profile/UserProfileContent";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const UserProfilePage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  const {
    user: { id },
    accessToken,
  } = session;

  const queryClient = getQueryClient();

  if (id) {
    await queryClient.prefetchQuery(
      getUserProfileQueryOptions(locale, id, accessToken)
    );
  }

  await queryClient.prefetchQuery(
    getStaticNationalityListQueryOptions(locale, accessToken)
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <UserProfileHeader />
      <UserProfileContent userId={id} />
    </div>
  );
};

export default UserProfilePage;
