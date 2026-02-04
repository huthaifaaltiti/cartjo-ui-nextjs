"use client";

import { memo } from "react";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-100 rounded ${className}`} />
);

const VerticalCardSkeleton = () => {
  return (
    <div className="w-full border border-grey-50/20 rounded-xl p-3 flex flex-col gap-3">
      {/* Image */}
      <Skeleton className="h-[23vh] sm:h-[22vh] max-[500px]:h-[18vh] w-full" />

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
  );
};

export default memo(VerticalCardSkeleton);
