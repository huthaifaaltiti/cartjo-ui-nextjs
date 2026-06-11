"use client";

import { memo } from "react";
import { useAdminUsers } from "@/contexts/AdminUsersContext";
import { useAdminUsersQuery } from "@/hooks/react-query/useAdminUsersQuery";
import UsersInfiniteScrollList from "@/components/admin/shared/UsersInfiniteScrollList";
import { ADMIN_USERS_QUERY_KEY } from "@/hooks/react-query/query-options/adminUsers";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useDebounce } from "@/hooks/useDebounce";
import ErrorMessage from "@/components/shared/ErrorMessage";
import AuthRedirect from "@/components/shared/AuthRedirect";
import PageLoader from "@/components/shared/PageLoader";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const AdminUsersList = () => {
  const tg = useTranslations("general");

  const { searchQuery, deleteUser, unDeleteUser, switchUserActiveStatus } =
    useAdminUsers();

  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const debouncedSearch = useDebounce<string>({
    value: searchQuery,
    delay: debouncingTime,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useAdminUsersQuery(debouncedSearch);

  const adminUsers = data?.pages.flatMap((page) => page.users) || [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = adminUsers?.length === 0 && !showLoader;
  const showData = adminUsers?.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/users/admin-users"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage message={error?.message || tg("data.failed")} />
      </div>
    );
  }

  if (showNoData) {
    return (
      <>
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500 text-lg">{tg("data.noData")}</p>
        </div>
      </>
    );
  }

  if (showData) {
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
        switchUserActiveStatus={switchUserActiveStatus}
        queryKey={ADMIN_USERS_QUERY_KEY}
      />
    );
  }

  return null;
};

export default memo(AdminUsersList);
