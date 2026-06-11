"use client";

import { memo } from "react";
import { useTotalUsersQuery } from "@/hooks/react-query/useTotalUsersQuery";
import { useTotalUsers } from "@/contexts/TotalUsersContext";
import UsersInfiniteScrollList from "@/components/admin/shared/UsersInfiniteScrollList";
import { useTranslations } from "next-intl";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";
import { TOTAL_USERS_QUERY_KEY } from "@/hooks/react-query/query-options/totalUsers";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const TotalUsersList = () => {
  const tg = useTranslations("general");
  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const { searchQuery, deleteUser, unDeleteUser, switchUserActiveStatus } =
    useTotalUsers();

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
  } = useTotalUsersQuery(debouncedSearch);

  const allUsers = data?.pages.flatMap((page) => page.users) || [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = allUsers?.length === 0 && !showLoader;
  const showData = allUsers?.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/users/total-users"} />;
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
        usersList={allUsers}
        fetchNextPage={fetchNextPage}
        deleteUser={deleteUser}
        unDeleteUser={unDeleteUser}
        switchUserActiveStatus={switchUserActiveStatus}
        queryKey={TOTAL_USERS_QUERY_KEY}
      />
    );
  }

  return null;
};

export default memo(TotalUsersList);
