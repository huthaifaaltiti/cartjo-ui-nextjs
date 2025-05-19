import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import assets from "../../public/assets/assets.json";

const UserAccountLink = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Link href={`/${locale}/account`}>
      <div className="flex items-start gap-2">
        <Image
          src={assets.image.svg.user_dark}
          alt="user icon"
          width={15}
          height={16}
        />

        <span className="text-text-primary-300 text-sm cursor-pointer">
          {t("routes.home.components.UserAccountLink.account")}
        </span>
      </div>
    </Link>
  );
};

export default memo(UserAccountLink);
