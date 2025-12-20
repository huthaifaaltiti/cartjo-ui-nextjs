import { fetchDeletedUsers } from "@/hooks/react-query/useDeletedUsersQuery";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import DeletedUsersPage from "@/components/admin/routes/users/deletedUsers/DeletedUsersPage";
import { requireAuth } from "@/utils/authRedirect";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();
  requireAuth(accessToken)

  const { users } = await fetchDeletedUsers({
    token: accessToken,
    limit: PAGINATION_LIMITS.DELETED_USERS,
    isDeleted: true,
  });

  return <DeletedUsersPage initialUsers={users} accessToken={accessToken} />;
}
