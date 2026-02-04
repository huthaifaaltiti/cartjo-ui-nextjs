"use client";

import { memo } from "react";
import VerticalCardSkeleton from "./cards/VerticalCardSkeleton";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded ${className}`} />
);

const GridItemsSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="w-full pt-5">
      {/* Filters skeleton */}
      <div className="w-full flex items-center flex-wrap gap-4 border-y border-grey-50/20 py-3 mb-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-48" />
      </div>

      {/* Products grid skeleton */}
      <div className="w-full grid grid-cols-2 max-[300px]:grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 place-items-center">
        {Array.from({ length: count }).map((_, idx) => (
          <VerticalCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};

export default memo(GridItemsSkeleton);
