import { ReactNode } from "react";

interface RowCardWrapperProps {
  children: ReactNode;
  isHovered: boolean;
  isLoading: boolean;
}

export default function RowCardWrapper({
  children,
  isHovered,
  isLoading,
}: RowCardWrapperProps) {
  return (
    <div
      className={`w-full h-full group relative overflow-hidden rounded-xl 
      shadow-sm hover:shadow-lg transition-all duration-300 
      transform flex items-stretch min-h-[180px] 
      bg-white-50 border border-gray-100 hover:border-gray-200
      ${isHovered ? "scale-[1.01] -translate-y-1" : "scale-100"}
      ${isLoading ? "pointer-events-none" : ""}
    `}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
      }}
    >
      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 bg-white-50/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="bg-white-50 rounded-full p-3 shadow-lg">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
