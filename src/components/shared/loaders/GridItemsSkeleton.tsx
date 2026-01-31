"use client";

import { memo } from "react";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const GridItemsSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="w-full pt-5">
      {/* Filters skeleton */}
      <div className="w-full flex items-center gap-4 border-y border-grey-50/20 py-3 mb-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-48" />
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-3 flex flex-col gap-3"
          >
            {/* Image */}
            <Skeleton className="h-[23vh] sm:h-[22vh] max-[500px]:h-[18vh]" />

            {/* Title */}
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />

            {/* Price + rating */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Button */}
            <Skeleton className="h-9 w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(GridItemsSkeleton);
