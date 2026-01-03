"use client";

import { memo } from "react";
import { useTotalUsersQuery } from "@/hooks/react-query/useTotalUsersQuery";
import { useTotalUsers } from "@/contexts/TotalUsersContext";
import { User } from "@/types/user";
import UsersInfiniteScrollList from "@/components/admin/shared/UsersInfiniteScrollList";

type TotalUsersListProps = {
  initialUsers: User[];
};

const TotalUsersList = ({ initialUsers }: TotalUsersListProps) => {
  const {
    searchQuery,
    deleteUser,
    unDeleteUser,
    accessToken,
    switchUserActiveStatus,
  } = useTotalUsers();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useTotalUsersQuery(searchQuery);

  const allUsers = data?.pages.flatMap((page) => page.users) || [
    ...initialUsers,
  ];

  return (
    <UsersInfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      error={!!error}
      usersList={allUsers}
      fetchNextPage={fetchNextPage}
      deleteUser={deleteUser}
      unDeleteUser={unDeleteUser}
      accessToken={accessToken}
      switchUserActiveStatus={switchUserActiveStatus}
      queryKey={"totalUsers"}
    />
  );
};

export default memo(TotalUsersList);
