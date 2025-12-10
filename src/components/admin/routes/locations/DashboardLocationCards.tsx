"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import DashboardLocationCard from "./DashboardLocationCard";

type LocationData = {
  name: { ar: string; en: string };
  price: string;
  subLocations: LocationData[];
};

type LocationCardsProps = {
  locations: LocationData[];
};

const DashboardLocationCards = ({ locations }: LocationCardsProps) => {
  const t = useTranslations();

  return (
    <div className="w-full border-t py-5">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-blue-600" />

        <h2 className="text-lg font-bold text-gray-800">
          {t("routes.dashboard.routes.locations.currentLocations")}
        </h2>
      </div>

      <div className="space-y-4">
        {locations?.map((location: LocationData, index: number) => (
          <DashboardLocationCard key={index} location={location} />
        ))}
      </div>
    </div>
  );
};

export default memo(DashboardLocationCards);
