import { getServerSession } from "next-auth";
import UsersPageContainer from "@/components/admin/routes/users/UsersPageContainer";
import { authOptions, CustomSession } from "@/lib/authOptions";
import { fetchUsersStats } from "@/hooks/react-query/useUsersStats";
import { ExtendedSession } from "@/types/session";
import { requireAuth } from "@/utils/authRedirect";

export default async function UsersPage() {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  const accessToken = (session as CustomSession)?.accessToken;
  requireAuth(accessToken);

  const { stats } = await fetchUsersStats(accessToken);

  return <UsersPageContainer stats={stats} />;
}
