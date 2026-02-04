import { memo } from "react";
import VerticalCardSkeleton from "@/components/shared/loaders/cards/VerticalCardSkeleton";

const RecommendedProductsLoading = () => {
  return (
    <div className="w-full space-y-6 p-6 animate-pulse">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="h-8 w-48 bg-gray-100 rounded mb-3" />
        <div className="h-8 w-80 bg-gray-100 rounded mb-4" />

        <div className="w-full grid grid-cols-1 max-[300px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
          {[...Array(4)].map((_, i) => (
            <VerticalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(RecommendedProductsLoading);
