import { ReactNode } from "react";

interface CardWrapperProps {
  children: ReactNode;
  isHovered?: boolean;
  isLoading?: boolean;
}

export default function CardWrapper({
  children,
  isHovered = false,
  isLoading = false,
}: CardWrapperProps) {
  return (
    <div
      className={`
        w-full h-full group relative overflow-hidden
        rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 ease-out
        transform flex flex-col p-3
        bg-white-50 border border-gray-100 hover:border-gray-200
        hover:-translate-y-2
        ${isHovered ? "scale-[1.02]" : "scale-100"}
        ${isLoading ? "pointer-events-none" : ""}
      `}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      {/* {isLoading && <LoadingOverlay />} */}
      {children}
    </div>
  );
}
