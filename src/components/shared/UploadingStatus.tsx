import { memo } from "react";
import LoadingDots from "./loaders/LoadingDots";

type UploadingStatusProps = {
  message: string;
  className?: string;
};

const UploadingStatus = ({ message, className = "" }: UploadingStatusProps) => {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <span className="text-sm md:text-lg">{message}</span>
      <LoadingDots />
    </div>
  );
};

export default memo(UploadingStatus);
