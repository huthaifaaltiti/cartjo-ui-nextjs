"use client";

import { memo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { DollarSign, MapPinned } from "lucide-react";

import { Locale } from "@/types/locale";

type LocationData = {
  name: { ar: string; en: string };
  price: string;
  subLocations: LocationData[];
};

type LocationCardProps = {
  location: LocationData;
  level?: number;
};

const DashboardLocationCard = ({ location, level = 0 }: LocationCardProps) => {
  const locale = useLocale();
  const t = useTranslations();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const marginLeft = level * 4;
  const bgColor =
    level % 2 == 0
      ? "bg-blue-50 border-blue-200"
      : "bg-blue-100 border-blue-300";

  return (
    <div
      className={`border rounded-lg p-4 mb-3 ${bgColor}`}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPinned className="h-5 w-5 text-blue-600" />

          <h3 className="font-semibold text-md text-gray-800">
            {location?.name[locale as Locale]}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white-50 px-3 py-1 rounded-full">
            <DollarSign className="h-4 w-4 text-green-600" />

            <span className="font-medium text-green-700">{location.price}</span>
          </div>

          {location.subLocations.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isExpanded
                ? t("routes.dashboard.components.DashboardLocationCard.hide")
                : t(
                    "routes.dashboard.components.DashboardLocationCard.show"
                  )}{" "}
              ({location.subLocations.length})
            </button>
          )}
        </div>
      </div>

      {isExpanded && location.subLocations.length > 0 && (
        <div className="mt-4">
          {location.subLocations.map((subLocation, index) => (
            <DashboardLocationCard
              key={index}
              location={subLocation}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(DashboardLocationCard);
