import { memo } from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>

          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-12 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetailsSkeleton);
