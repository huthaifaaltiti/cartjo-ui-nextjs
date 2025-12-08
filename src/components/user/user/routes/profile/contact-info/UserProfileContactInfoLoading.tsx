import InfoCard from "@/components/shared/InfoCard";
import { useTranslations } from "next-intl";
import { memo } from "react";

const UserProfileContactInfoLoading = () => {
  const t = useTranslations();

  return (
    <InfoCard>
      <h2 className="font-bold text-neutral-600 mb-3">
        {t(
          "routes.user.layout.routes.profile.components.UserProfileContactInfo.title"
        )}
      </h2>

      <div className="w-full flex items-center justify-between gap-5 animate-pulse">
        {/* Phone Number Skeleton */}
        <div className="w-1/2">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded-md" /> {/* Label */}
            <div className="h-9 w-full bg-gray-200 rounded-md" /> {/* Input */}
          </div>
        </div>

        {/* Email Skeleton */}
        <div className="w-1/2">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-gray-200 rounded-md" />
            <div className="h-9 w-full bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>
    </InfoCard>
  );
};

export default memo(UserProfileContactInfoLoading);
