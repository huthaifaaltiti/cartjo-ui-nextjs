import { getServerSession } from "next-auth";

import UsersPageContainer from "@/components/admin/routes/users/UsersPageContainer";

import { authOptions, CustomSession } from "@/lib/authOptions";
import { ExtendedSession } from "@/types/session";
import { fetchUsersStats } from "@/hooks/react-query/useUsersStats";

export default async function UsersPage() {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  const accessToken = (session as CustomSession)?.accessToken;

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const { stats } = await fetchUsersStats(accessToken);

  return (
    <div className="w-full h-full">
      <UsersPageContainer stats={stats} />
    </div>
  );
}
