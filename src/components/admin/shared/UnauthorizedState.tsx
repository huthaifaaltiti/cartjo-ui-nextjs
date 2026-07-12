import { ReactNode } from "react";
import { ShieldAlert, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface UnauthorizedStateProps {
  title?: string;
  description?: string | ReactNode;
  Icon?: LucideIcon;
  minHeight?: string;
}

export const UnauthorizedState = ({
  title,
  description,
  Icon = ShieldAlert,
  minHeight = "min-h-[50vh]",
}: UnauthorizedStateProps) => {
  const t = useTranslations("components.UnauthorizedState");

  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center gap-2 p-4 text-center`}
    >
      <Icon className="w-12 h-12 text-red-500 animate-pulse" />
      <h3 className="text-xl font-semibold text-gray-800">
        {title || t("title")}
      </h3>
      
        <p className="text-gray-500 max-w-md">{description || t("desc")}</p>
      
    </div>
  );
};

export default UnauthorizedState;
