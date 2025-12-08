import { memo } from "react";

const SearchItemsLoading = () => {
  return (
    <div className="w-full">
      <div className="w-full h-12 bg-gray-100 animate-pulse rounded mb-3" />
      <div className="w-full flex items-center justify-between">
        <div className="w-1/2 h-8 bg-gray-100 animate-pulse rounded" />
        <div className="w-24 h-8 bg-gray-100 animate-pulse rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gray-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export default memo(SearchItemsLoading);
