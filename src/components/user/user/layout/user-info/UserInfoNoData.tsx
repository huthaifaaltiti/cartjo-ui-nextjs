import { useTranslations } from "next-intl";
import { memo } from "react";

const UserInfoNoData = () => {
  const t = useTranslations();

  return (
    <div className="text-gray-500 text-sm">
      {t("routes.user.layout.components.UserInfoRow.noData")}
    </div>
  );
};

export default memo(UserInfoNoData);
