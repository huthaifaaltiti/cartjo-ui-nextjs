import { ReactNode } from "react";

interface RowCardWrapperProps {
  children: ReactNode;
  isHovered?: boolean;
  isLoading?: boolean;
}

export default function RowCardWrapper({
  children,
  isHovered = false,
  isLoading = false,
}: RowCardWrapperProps) {
  return (
    <div
      className={`
        w-full h-full group relative overflow-hidden rounded-xl
        shadow-sm hover:shadow-lg transition-all duration-300
        flex items-stretch min-h-[180px]
        bg-white-50 border border-gray-100 hover:border-gray-200
        ${isHovered ? "scale-[1.01] -translate-y-1" : "scale-100"}
        ${isLoading ? "pointer-events-none" : ""}
      `}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
      }}
    >
      {/* {isLoading && <LoadingOverlay />} */}
      {children}
    </div>
  );
}
