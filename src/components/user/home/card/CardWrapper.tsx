import { ReactNode } from "react";

interface CardWrapperProps {
  children: ReactNode;
  isHovered: Boolean;
  isLoading: Boolean;
}

export default function CardWrapper({
  children,
  isHovered,
  isLoading,
}: CardWrapperProps) {
  return (
    <div
      className={`w-full h-full group relative overflow-hidden 
      bg-white-50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 
      ease-out transform hover:-translate-y-2 flex flex-col p-3 ${
        isHovered ? "scale-[1.02]" : "scale-100"
      } border border-gray-100 hover:border-gray-200 ${
        isLoading ? "pointer-events-none" : ""
      }`}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      {children}
    </div>
  );
}
