import Link from "next/link";
import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";

const UserDashboardLink = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Link href={`/${locale}/dashboard`}>
      <Button variant="ghost" className="flex items-center gap-1">
        <LayoutDashboard className="w-4 h-4" />
        {t("routes.home.components.UserDashboardLink.dashboard")}
      </Button>
    </Link>
  );
};

export default memo(UserDashboardLink);
