import Link from "next/link";
import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const UserCreatorDashboardLink = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Link href={`/${locale}/creators/dashboard`}>
      <Button
        variant="ghost"
        className="flex items-center gap-1.5 text-purple-700 hover:text-purple-800 hover:bg-purple-50 font-medium"
      >
        <Sparkles className="w-4 h-4 text-purple-600" />
        {t("routes.home.components.UserCreatorDashboardLink.dashboard") ||
          "Creator Studio"}
      </Button>
    </Link>
  );
};

export default memo(UserCreatorDashboardLink);

