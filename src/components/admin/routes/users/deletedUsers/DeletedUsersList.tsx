"use client";

import { memo } from "react";

import { useDeletedUsersQuery } from "@/hooks/react-query/useDeletedUsersQuery";
import { useDeletedUsers } from "@/contexts/DeletedUsersContext";
import { User } from "@/types/user";

import UsersInfiniteScrollList from "@/components/admin/shared/UsersInfiniteScrollList";

type DeletedUsersListProps = {
  initialUsers: User[];
};

const DeletedUsersList = ({ initialUsers }: DeletedUsersListProps) => {
  const {
    searchQuery,
    deleteUser,
    unDeleteUser,
    accessToken,
    switchUserActiveStatus,
  } = useDeletedUsers();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useDeletedUsersQuery(searchQuery);

  const deletedUsers = data?.pages.flatMap((page) => page.users) || [
    ...initialUsers,
  ];

  return (
    <UsersInfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      error={!!error}
      usersList={deletedUsers}
      fetchNextPage={fetchNextPage}
      deleteUser={deleteUser}
      unDeleteUser={unDeleteUser}
      accessToken={accessToken}
      switchUserActiveStatus={switchUserActiveStatus}
      queryKey={"deletedUsers"}
    />
  );
};

export default memo(DeletedUsersList);
