"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { User } from "@/types/user";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import DashboardUserCard from "./DashboardUserCard";
import {
  DeleteUserResponse,
  SwitchUserActiveStatusResponse,
  UnDeleteUserResponse,
} from "@/types/totalUser";
import { Locale } from "@/types/locale";

type Props = {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error?: boolean;
  usersList: User[];
  fetchNextPage?: () => void;
  deleteUser: (
    accessToken: string,
    userId: string
  ) => Promise<DeleteUserResponse>;
  unDeleteUser: (
    accessToken: string,
    userId: string
  ) => Promise<UnDeleteUserResponse>;
  accessToken: string;
  switchUserActiveStatus: (
    token: string,
    lang: Locale | string,
    isActive: boolean,
    userId: string
  ) => Promise<SwitchUserActiveStatusResponse>;
  queryKey: string;
};

const UsersInfiniteScrollList = ({
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  error,
  usersList,
  fetchNextPage,
  deleteUser,
  unDeleteUser,
  accessToken,
  switchUserActiveStatus,
  queryKey,
}: Props) => {
  const t = useTranslations();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        fetchNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !fetchNextPage) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleObserver, fetchNextPage]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {isLoading
            ? t("general.loadingStates.loading")
            : `${usersList.length} ${t(
                "routes.dashboard.routes.users.routes.totalUsers.components.TotalUsersList.usersFound"
              )}`}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usersList
          .filter(
            (user) => user?._id !== process.env.NEXT_PUBLIC_DB_SYSTEM_OBJ_ID
          )
          .map((user, index) => (
            <DashboardUserCard
              key={`${user._id}-${index}`}
              user={user}
              deleteUser={deleteUser}
              unDeleteUser={unDeleteUser}
              accessToken={accessToken}
              switchUserActiveStatus={switchUserActiveStatus}
              queryKey={queryKey}
            />
          ))}
      </div>

      {(isLoading || isFetchingNextPage) && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      <div ref={loadMoreRef} className="h-4" />

      {!hasNextPage && usersList.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          {t(
            "routes.dashboard.routes.users.routes.totalUsers.components.TotalUsersList.noUsersToLoad"
          )}
        </div>
      )}

      {!isLoading && usersList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t(
            "routes.dashboard.routes.users.routes.totalUsers.components.TotalUsersList.noUsersFound"
          )}
        </div>
      )}

      {error && usersList.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ErrorMessage
            message={t(
              "routes.dashboard.routes.users.routes.totalUsers.components.TotalUsersList.errors.totalUsersFetchingFailure"
            )}
          />
        </div>
      )}
    </div>
  );
};

export default memo(UsersInfiniteScrollList);
