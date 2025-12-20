import { fetchActiveUsers } from "@/hooks/react-query/useActiveUsersQuery";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import ActiveUsersPage from "@/components/admin/routes/users/activeUsers/ActiveUsersPage";
import { requireAuth } from "@/utils/authRedirect";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();
  requireAuth(accessToken)

  const { users } = await fetchActiveUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.ACTIVE_USERS,
    isActive: true,
  });

  return <ActiveUsersPage initialUsers={users} accessToken={accessToken} />;
}
