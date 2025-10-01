import { memo } from "react";

const ProductAddCommentLoading = () => (
  <div className="space-y-4">
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 mb-6 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-40 mb-4" /> {/* Title */}
      {/* Rating stars */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2" /> {/* Label */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="w-5 h-5 rounded bg-gray-200" />
          ))}
        </div>
      </div>
      {/* Comment textarea */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-28 mb-2" /> {/* Label */}
        <div className="w-full h-20 bg-gray-200 rounded-lg" /> {/* Textarea */}
        <div className="h-3 bg-gray-200 rounded w-24 mt-2" />{" "}
        {/* Characters count */}
      </div>
      {/* Error placeholder */}
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
      {/* Submit button */}
      <div className="flex justify-end">
        <div className="h-8 w-24 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

export default memo(ProductAddCommentLoading);
