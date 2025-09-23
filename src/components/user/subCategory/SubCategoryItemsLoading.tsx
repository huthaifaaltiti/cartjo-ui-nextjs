import { memo } from "react";

const CategoryItemsLoading = () => {
  return (
    <div className="w-full">
      <div className="w-1/3 h-8 bg-gray-100 animate-pulse rounded" />

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

export default memo(CategoryItemsLoading);
