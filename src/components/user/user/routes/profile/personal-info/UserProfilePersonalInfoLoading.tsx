"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import InfoCard from "@/components/shared/InfoCard";

const UserProfilePersonalInfoLoading = () => {
  const t = useTranslations();

  return (
    <InfoCard>
      <h2 className="font-bold text-neutral-600 mb-3">
        {t(
          "routes.user.layout.routes.profile.components.UserProfilePersonalInfo.title"
        )}
      </h2>

      <div className="w-full flex flex-col gap-5 animate-pulse">
        {/* Row 1: First Name, Last Name, Nationality */}
        <div className="w-full flex gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1/3 min-w-[200px] flex flex-col gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded-md" /> {/* Label */}
              <div className="h-9 w-full bg-gray-200 rounded-md" />{" "}
              {/* Input */}
            </div>
          ))}
        </div>

        {/* Row 2: Birth Date, Gender */}
        <div className="w-full flex gap-5">
          {[0, 1].map((i) => (
            <div key={i} className="w-1/3 min-w-[200px] flex flex-col gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded-md" /> {/* Label */}
              <div className="h-9 w-full bg-gray-200 rounded-md" />{" "}
              {/* Input */}
            </div>
          ))}
        </div>
      </div>
    </InfoCard>
  );
};

export default memo(UserProfilePersonalInfoLoading);
