import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import assets from "../../../public/assets/assets.json";

const UserDashboardLink = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Link href={`/${locale}/dashboard`}>
      <div className="flex items-start gap-2">
        <Image
          src={assets.image.svg.dashboard_dark}
          alt="user icon"
          width={15}
          height={16}
        />

        <span className="text-text-primary-300 text-sm cursor-pointer">
          {t("routes.home.components.UserDashboardLink.dashboard")}
        </span>
      </div>
    </Link>
  );
};

export default memo(UserDashboardLink);
