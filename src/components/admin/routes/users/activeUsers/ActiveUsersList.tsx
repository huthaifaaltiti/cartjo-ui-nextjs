"use client";

import { memo } from "react";

import { useActiveUsersQuery } from "@/hooks/react-query/useActiveUsersQuery";
import { useActiveUsers } from "@/contexts/ActiveUsersContext";
import { User } from "@/types/user";

import UsersInfiniteScrollList from "@/components/admin/shared/UsersInfiniteScrollList";

type ActiveUsersListProps = {
  initialUsers: User[];
};

const ActiveUsersList = ({ initialUsers }: ActiveUsersListProps) => {
  const {
    searchQuery,
    deleteUser,
    unDeleteUser,
    accessToken,
    switchUserActiveStatus,
  } = useActiveUsers();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useActiveUsersQuery(searchQuery);

  const activeUsers = data?.pages.flatMap((page) => page.users) || [
    ...initialUsers,
  ];

  return (
    <UsersInfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      error={!!error}
      usersList={activeUsers}
      fetchNextPage={fetchNextPage}
      deleteUser={deleteUser}
      unDeleteUser={unDeleteUser}
      accessToken={accessToken}
      switchUserActiveStatus={switchUserActiveStatus}
      queryKey={"activeUsers"}
    />
  );
};

export default memo(ActiveUsersList);
