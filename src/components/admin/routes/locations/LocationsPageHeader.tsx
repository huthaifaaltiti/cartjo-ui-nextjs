import { useTranslations } from "next-intl";

const LocationsPageHeader = () => {
  const t = useTranslations();

  return (
    <div className="mb-3 pb-3 border-b">
      <h1 className="text-xl font-bold text-gray-900">
        {t("routes.dashboard.title")}
      </h1>
      <p className="text-gray-600 text-sm">{t("routes.dashboard.desc")}</p>
    </div>
  );
};

export default LocationsPageHeader;
