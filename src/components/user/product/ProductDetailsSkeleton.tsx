const ProductDetailsSkeleton = () => {
  return (
    <div className="w-full mx-auto px-3 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
        {/* Image Section Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />

          <div className="flex gap-2 overflow-x-auto pb-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col gap-6">
          {/* Tags */}
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Title + Rating */}
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />

            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Variant Selector */}
          <div className="space-y-3">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />

            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Attributes */}
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Colors */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-32 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-11 flex-1 bg-gray-200 rounded-xl animate-pulse" />
          </div>

          {/* Subtotal */}
          <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
