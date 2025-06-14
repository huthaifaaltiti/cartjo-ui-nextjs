"use client";

import { memo } from "react";

import { useAdminUsers } from "@/contexts/AdminUsersContext";
import { useAdminUsersQuery } from "@/hooks/react-query/useAdminUsersQuery";
import { User } from "@/types/user";

import UsersInfiniteScrollList from "@/components/admin/shared/UsersInfiniteScrollList";

type AdminUsersListProps = {
  initialUsers: User[];
};

const AdminUsersList = ({ initialUsers }: AdminUsersListProps) => {
  const {
    searchQuery,
    deleteUser,
    unDeleteUser,
    accessToken,
    switchUserActiveStatus,
  } = useAdminUsers();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useAdminUsersQuery(searchQuery);

  const adminUsers = data?.pages.flatMap((page) => page.users) || [
    ...initialUsers,
  ];

  return (
    <UsersInfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      error={!!error}
      usersList={adminUsers}
      fetchNextPage={fetchNextPage}
      deleteUser={deleteUser}
      unDeleteUser={unDeleteUser}
      accessToken={accessToken}
      switchUserActiveStatus={switchUserActiveStatus}
      queryKey={"adminUsers"}
    />
  );
};

export default memo(AdminUsersList);
