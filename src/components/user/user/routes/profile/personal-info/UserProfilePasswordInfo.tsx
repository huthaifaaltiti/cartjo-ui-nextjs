import { memo } from "react";
import { useTranslations } from "next-intl";
import InfoCard from "@/components/shared/InfoCard";
import UserProfilePasswordInfoContent from "./UserProfilePasswordInfoContent";

const UserProfilePasswordInfo = () => {
  const t = useTranslations();

  return (
    <InfoCard>
      <h2 className="font-bold text-neutral-600 mb-3">
        {t(
          "routes.user.layout.routes.profile.components.UserProfilePasswordInfo.title",
        )}
      </h2>

      <UserProfilePasswordInfoContent />
    </InfoCard>
  );
};

export default memo(UserProfilePasswordInfo);
