import { memo } from "react";
import LoadingSpinner from "./LoadingSpinner";

const PageLoader = () => {
  return (
    <div className="w-full h-[75vh] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default memo(PageLoader);
