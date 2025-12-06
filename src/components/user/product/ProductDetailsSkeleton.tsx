import { memo } from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="w-full mx-auto px-3 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
        {/* Image Section Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="
                  flex-shrink-0
                  w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                  bg-gray-200 rounded-lg animate-pulse
                "
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6 sm:space-y-8">
          {/* Title + Rating */}
          <div className="space-y-3">
            <div className="h-6 sm:h-8 md:h-10 bg-gray-200 rounded animate-pulse w-3/4"></div>

            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
              <div className="w-14 sm:w-16 h-3 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="h-6 sm:h-8 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>

          {/* Quantity + Cart */}
          <div className="flex items-center space-x-4">
            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg animate-pulse w-28 sm:w-32"></div>
            <div className="h-10 sm:h-12 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
            <div className="h-10 sm:h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="
                  h-14 sm:h-16 md:h-20
                  bg-gray-200 rounded-lg animate-pulse
                "
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetailsSkeleton);
