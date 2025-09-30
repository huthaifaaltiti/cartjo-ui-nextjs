import { memo } from "react";

type AvatarProps = {
  firstName: string;
  lastName: string;
  bgClassName?: string;
  textClassName?: string;
};

const UserAvatarByName = ({
  firstName,
  lastName,
  bgClassName = "bg-gradient-to-br from-blue-500 to-purple-600",
  textClassName = "text-white-50",
}: AvatarProps) => {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${bgClassName} ${textClassName}`}
    >
      {initials.toUpperCase()}
    </div>
  );
};

export default memo(UserAvatarByName);
