import { useTranslations } from "next-intl";

const PrivacyPolicyHeader = () => {
  const t = useTranslations();

  return (
    <div className="w-full h-auto bg-gradient-to-r from-white-50 via-gray-50 to-white-50 mb-3">
      <div className="w-full min-h-40 flex flex-col items-center justify-center">
        <h1 className="!text-3xl !leading-none">
          {t("routes.privacyPolicy.components.PrivacyPolicyHeader.title")}
        </h1>
        <p className="!text-xs !leading-none">
          {t("routes.privacyPolicy.components.PrivacyPolicyHeader.lastUpdated")}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyHeader;
