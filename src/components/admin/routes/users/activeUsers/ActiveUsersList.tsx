"use client";

import { memo } from "react";
import { useActiveUsersQuery } from "@/hooks/react-query/useActiveUsersQuery";
import { useActiveUsers } from "@/contexts/ActiveUsersContext";
import UsersInfiniteScrollList from "@/components/admin/shared/UsersInfiniteScrollList";
import { ACTIVE_USERS_QUERY_KEY } from "@/hooks/react-query/query-options/dashboard/activeUsers";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";

const ActiveUsersList = () => {
  const t = useTranslations();

  const { isSessionLoading, isAuthenticated } = useAuthContext();
  const { searchQuery, deleteUser, unDeleteUser, switchUserActiveStatus } =
    useActiveUsers();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useActiveUsersQuery(searchQuery);

  const activeUsers = data?.pages?.flatMap((page) => page.users) ?? [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = activeUsers.length === 0 && !showLoader;
  const showData = activeUsers.length > 0;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/users/active-users"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage
          message={error?.message || "Failed to load dashboard active users"}
        />
      </div>
    );
  }

  if (showNoData)
    return (
      <>
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500 text-lg">
            {t("routes.dashboard.routes.users.noData", { search: searchQuery })}
          </p>
        </div>
      </>
    );

  if (showData) {
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
        switchUserActiveStatus={switchUserActiveStatus}
        queryKey={ACTIVE_USERS_QUERY_KEY}
      />
    );
  }

  return null;
};

export default memo(ActiveUsersList);
