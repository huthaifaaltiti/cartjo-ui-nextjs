import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const NoLoggedUserState = () => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Image
        src="/assets/image/webp/computer-security-with-login-password-padlock.webp"
        alt="Computer Security Illustration"
        width={600}
        height={300}
        priority
      />

      <h1 className="text-2xl font-bold text-text-primary-400 mb-4">
        {t("routes.dashboard.components.NoLoggedUserState.notLoggedIn")}
      </h1>

      <p className="text-text-primary-100">
        {t("routes.dashboard.components.NoLoggedUserState.goTo")}{" "}
        <Link
          href={`/${locale}/auth`}
          className="text-blue-500 underline hover:text-blue-700"
        >
          {t("routes.dashboard.components.NoLoggedUserState.pathLink")}
        </Link>{" "}
        {t("routes.dashboard.components.NoLoggedUserState.toLogin")}
      </p>
    </div>
  );
};

export default memo(NoLoggedUserState);
