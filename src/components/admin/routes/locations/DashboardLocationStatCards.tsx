import { memo } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

import StatCard from "@/components/shared/StatCard";

import { StatCardType } from "@/types/statCard";

type LocationData = {
  name: { ar: string; en: string };
  price: string;
  subLocations: LocationData[];
};

type LocationCardsProps = {
  locations: LocationData[];
};

const DashboardLocationStatCards = ({ locations }: LocationCardsProps) => {
  const t = useTranslations();

  const countAllLocations = (locations: LocationData[]): number => {
    let count = 0;

    const traverse = (locs: LocationData[]) => {
      for (const loc of locs) {
        count += 1;

        if (Array.isArray(loc.subLocations) && loc.subLocations.length > 0) {
          traverse(loc.subLocations);
        }
      }
    };

    traverse(locations);

    return count;
  };

  const totalLocations: number = Array.isArray(locations)
    ? countAllLocations(locations)
    : 0;

  const locationsList: StatCardType[] = [
    {
      label: t(
        "routes.dashboard.routes.locations.components.DashboardLocationsStatCards.totalLocations"
      ),
      value: totalLocations,
      color: "purple",
      icon: MapPin,
    },
    {
      label: t(
        "routes.dashboard.routes.locations.components.DashboardLocationsStatCards.mainLocations"
      ),
      value: locations?.length,
      color: "green",
      icon: MapPin,
    },
    {
      label: t(
        "routes.dashboard.routes.locations.components.DashboardLocationsStatCards.subLocations"
      ),
      value: totalLocations - locations?.length,
      color: "teal",
      icon: MapPin,
    },
  ];

  return (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t">
      {locationsList.map((loc, i) => (
        <StatCard
          label={loc.label}
          value={loc.value}
          color={loc.color}
          icon={loc.icon}
          key={`locationStatCard-${i}`}
        />
      ))}
    </div>
  );
};

export default memo(DashboardLocationStatCards);
