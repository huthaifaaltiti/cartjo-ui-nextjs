import { memo } from "react";
import { useTranslations } from "next-intl";

const UserProfileHeader = () => {
  const t = useTranslations();

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold text-neutral-600">
        {t(
          "routes.user.layout.routes.profile.components.UserProfileHeader.title"
        )}
      </h1>
      <p className="text-neutral-600">
        {t(
          "routes.user.layout.routes.profile.components.UserProfileHeader.description"
        )}
      </p>
    </div>
  );
};

export default memo(UserProfileHeader);
