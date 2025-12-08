import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const RegularUserLoggedState = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Image
        src="/assets/image/webp/purpleshiny-metallic-padlock-with-a-keyhole.webp"
        alt="Computer Security Illustration"
        width={400}
        height={200}
        priority
      />

      <h1 className="text-text-primary-300 font-extrabold text-5xl capitalize">
        {t("routes.dashboard.components.AuthUserDashboard.welcomeBack")}
      </h1>

      <p className="text-primary-600 font-semibold my-2 text-lg">
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
