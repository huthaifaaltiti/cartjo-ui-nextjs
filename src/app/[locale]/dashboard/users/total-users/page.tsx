import { getServerSession } from "next-auth";

import { ExtendedSession } from "@/types/session";

import { authOptions, CustomSession } from "@/lib/authOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { fetchTotalUsers } from "@/hooks/react-query/useTotalUsersQuery";

import TotalUsersPage from "@/components/admin/routes/users/totalUsers/TotalUsersPage";

export default async function Page() {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  const accessToken = (session as CustomSession)?.accessToken;

  if (!accessToken) {
    throw new Error("Unauthorized token");
  }

  const { users } = await fetchTotalUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.INITIAL_TOTAL_USERS_LIMIT,
  });

  return <TotalUsersPage initialUsers={users} accessToken={accessToken} />;
}
