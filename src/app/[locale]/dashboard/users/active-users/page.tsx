import { fetchActiveUsers } from "@/hooks/react-query/useActiveUsersQuery";

import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

import ActiveUsersPage from "@/components/admin/routes/users/activeUsers/ActiveUsersPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  const { users } = await fetchActiveUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.INITIAL_ACTIVE_USERS_LIMIT,
    isActive: true,
  });

  return <ActiveUsersPage initialUsers={users} accessToken={accessToken} />;
}
