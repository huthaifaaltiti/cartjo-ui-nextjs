import { memo } from "react";

interface InfoCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}

const InfoCard = ({ children, title, className = "" }: InfoCardProps) => {
  return (
    <div className="w-full">
      <h4 className="mx-3 my-1 text-xs text-text-primary-100 font-semibold uppercase">
        {title}
      </h4>
      <div className={`w-full bg-secondary-300 rounded-xl p-4 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default memo(InfoCard);
