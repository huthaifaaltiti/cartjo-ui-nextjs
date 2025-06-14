import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { fetchTotalUsers } from "@/hooks/react-query/useTotalUsersQuery";

import TotalUsersPage from "@/components/admin/routes/users/totalUsers/TotalUsersPage";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  const { users } = await fetchTotalUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.INITIAL_TOTAL_USERS_LIMIT,
  });

  return <TotalUsersPage initialUsers={users} accessToken={accessToken} />;
}
