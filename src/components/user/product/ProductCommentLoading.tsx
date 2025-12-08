import { memo } from "react";
import ProductAddCommentLoading from "./ProductAddCommentLoading";

const ProductCommentsLoading = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <ProductAddCommentLoading key={i} />
    ))}
  </div>
);

export default memo(ProductCommentsLoading);
