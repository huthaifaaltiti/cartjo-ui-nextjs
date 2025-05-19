import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import assets from "../../public/assets/assets.json";

const UserSignInLink = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Link href={`/${locale}/auth`}>
      <span className="flex items-center gap-1">
        <Image
          src={assets.image.svg.enter_dark}
          alt="user icon"
          width={15}
          height={16}
        />
        <span className="text-text-primary-200 text-sm cursor-pointer">
          {t("routes.home.components.UserMenu.signIn")}
        </span>
      </span>
    </Link>
  );
};

export default memo(UserSignInLink);
