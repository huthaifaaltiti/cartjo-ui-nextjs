import { memo } from "react";

const UserInfoRowSkeleton = () => {
  return (
    <div className="w-full flex items-center gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-gray-300" />

      <div className="flex flex-col gap-2 w-auto">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default memo(UserInfoRowSkeleton);
