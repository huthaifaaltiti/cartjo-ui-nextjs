import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const RegularUserLoggedState = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="w-full h-full flex flex-col items-center">
      <Image
        src="/assets/image/webp/computer-security-with-login-password-padlock.webp"
        alt="Computer Security Illustration"
        width={600}
        height={300}
        priority
      />

      <h1>{t("routes.dashboard.components.AuthUserDashboard.welcomeBack")}</h1>
      <p className="text-gray-600">
        {" "}
        {t("routes.dashboard.components.AuthUserDashboard.loggedAsUser")}
      </p>

      <Link
        href={`/${locale}`}
        className="mt-5 uppercase text-primary-500 inline-block border border-primary-500 px-4 py-2 rounded"
      >
        {t("routes.dashboard.components.AuthUserDashboard.navigateToHome")}
      </Link>
    </div>
  );
};

export default memo(RegularUserLoggedState);
