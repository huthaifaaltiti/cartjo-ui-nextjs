import { memo } from "react";

type NoDataProps = {
  title: string;
  description?: string;
  className?: string;
};

const NoData = ({ title, description, className = "" }: NoDataProps) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <div className="text-center text-gray-500">
        <p className="text-lg font-medium">{title}</p>
        {description && <p className="text-sm mt-2">{description}</p>}
      </div>
    </div>
  );
};

export default memo(NoData);
