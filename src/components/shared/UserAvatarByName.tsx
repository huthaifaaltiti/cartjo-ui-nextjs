import { memo } from "react";
import { useTranslations } from "next-intl";

type AvatarProps = {
  firstName: string;
  lastName: string;
  bgClassName?: string;
  textClassName?: string;
  size?: "sm" | "md" | "lg";
};

const UserAvatarByName = ({
  firstName,
  lastName,
  bgClassName = "bg-gradient-to-br from-blue-500 to-purple-600",
  textClassName = "text-white-50",
  size = "md",
}: AvatarProps) => {
  const t = useTranslations();

  const fN = t("components.UserAvatarByName.fN");
  const lN = t("components.UserAvatarByName.lN");

  const initials = `${firstName[0] ?? fN[0]}${lastName[0] ?? lN[0]}`;

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${bgClassName} ${textClassName} ${sizeClasses[size]}`}
    >
      {initials.toUpperCase()}
    </div>
  );
};

export default memo(UserAvatarByName);
