import { fetchAdminUsers } from "@/hooks/react-query/useAdminUsersQuery";

import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

import AdminUsersPage from "@/components/admin/routes/users/adminUsers/AdminUsersPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  const { users } = await fetchAdminUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.INITIAL_ADMIN_USERS_LIMIT,
    canManage: true,
  });

  return <AdminUsersPage initialUsers={users} accessToken={accessToken} />;
}
