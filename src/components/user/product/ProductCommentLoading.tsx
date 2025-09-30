import { memo } from "react";

const ProductCommentLoading = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
        <div className="ml-13 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    ))}
  </div>
);

export default memo(ProductCommentLoading);
