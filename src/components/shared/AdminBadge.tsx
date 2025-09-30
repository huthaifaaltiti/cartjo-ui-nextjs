import { Shield } from "lucide-react";

interface AdminBadgeProps {
  label?: string;
  size?: "xs" | "sm" | "md";
  showIcon?: boolean;
  className?: string;
}

const AdminBadge = ({
  label = "Admin",
  size = "sm",
  showIcon = true,
  className = "",
}: AdminBadgeProps) => {
  const sizeClasses = {
    xs: "text-[10px] px-1.5 py-0.5 gap-0.5",
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
  };

  const iconSizes = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
  };

  return (
    <span
      className={`inline-flex items-center bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200 ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Shield className={iconSizes[size]} />}
      {label}
    </span>
  );
};

export default AdminBadge;
