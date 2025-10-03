import { memo } from "react";

const RecommendedProductsLoading = () => {
  return (
    <div className="w-full space-y-6 p-6 animate-pulse">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="h-8 w-48 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-80 bg-gray-200 rounded mb-4" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="min-w-48 w-full h-72 bg-gray-200 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(RecommendedProductsLoading);
