"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useTotalUsersQuery } from "@/hooks/react-query/useTotalUsersQuery";
import { useTotalUsers } from "@/contexts/TotalUsersContext";
import { User } from "@/types/user";
import UserCard from "./UserCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

type TotalUsersListProps = {
  initialUsers: User[];
};

const TotalUsersList = ({ initialUsers }: TotalUsersListProps) => {
  const { searchQuery } = useTotalUsers();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;

      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (!isLoading) {
    return (
      <div className="space-y-4">
        {/* Users count */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {isLoading ? "Loading..." : `${allUsers.length} users found`}
          </p>
        </div>

        {/* Users grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allUsers.map((user, index) => (
            <UserCard key={`${user._id}-${index}`} user={user} />
          ))}
        </div>

        {/* Loading states */}
        {(isLoading || isFetchingNextPage) && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Intersection observer target */}
        <div ref={loadMoreRef} className="h-4" />

        {/* End message */}
        {!hasNextPage && allUsers.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            No more users to load
          </div>
        )}

        {/* Empty state */}
        {!isLoading && allUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}

        {/* Empty state */}
        {error && allUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Error while fetching users</p>
          </div>
        )}
      </div>
    );
  }
};

export default memo(TotalUsersList);
