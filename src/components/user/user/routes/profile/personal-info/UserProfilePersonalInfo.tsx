import { memo } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/types/user";
import InfoCard from "@/components/shared/InfoCard";
import UserProfilePersonalInfoContent from "./UserProfilePersonalInfoContent";

const UserProfilePersonalInfo = ({ user }: { user: User | null }) => {
  const t = useTranslations();

  return (
    <InfoCard>
      <h2 className="font-bold text-neutral-600 mb-3">
        {t(
          "routes.user.layout.routes.profile.components.UserProfilePersonalInfo.title"
        )}
      </h2>

      <UserProfilePersonalInfoContent user={user} />
    </InfoCard>
  );
};

export default memo(UserProfilePersonalInfo);
