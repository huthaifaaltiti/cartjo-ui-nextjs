import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { fetchTotalUsers } from "@/hooks/react-query/useTotalUsersQuery";
import TotalUsersPage from "@/components/admin/routes/users/totalUsers/TotalUsersPage";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { requireAuth } from "@/utils/authRedirect";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();
  requireAuth(accessToken)

  const { users } = await fetchTotalUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.TOTAL_USERS,
  });

  return <TotalUsersPage initialUsers={users} accessToken={accessToken} />;
}
