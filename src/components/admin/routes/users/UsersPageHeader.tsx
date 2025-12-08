import { useTranslations } from "next-intl";

const UsersPageHeader = () => {
  const t = useTranslations();

  return (
    <div className="mb-3 pb-3 border-b">
      <h1 className="text-xl font-bold text-gray-900">
        {t("routes.dashboard.routes.users.title")}
      </h1>
      <p className="text-gray-600 text-sm">
        {t("routes.dashboard.routes.users.desc")}
      </p>
    </div>
  );
};

export default UsersPageHeader;
