import { fetchDeletedUsers } from "@/hooks/react-query/useDeletedUsersQuery";

import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

import DeletedUsersPage from "@/components/admin/routes/users/deletedUsers/DeletedUsersPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  const { users } = await fetchDeletedUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.INITIAL_TOTAL_USERS_LIMIT,
    isDeleted: true,
  });

  return <DeletedUsersPage initialUsers={users} accessToken={accessToken} />;
}
