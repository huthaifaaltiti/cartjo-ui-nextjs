import { memo } from "react";
import DashboardLocationStatCard from "./DashboardLocationStatCard";

type LocationData = {
  name: { ar: string; en: string };
  price: string;
  subLocations: LocationData[];
};

type LocationCardsProps = {
  locations: LocationData[];
};

const DashboardLocationStatCards = ({ locations }: LocationCardsProps) => {
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

  const totalLocations = Array.isArray(locations)
    ? countAllLocations(locations)
    : 0;

  return (
    <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t">
      <DashboardLocationStatCard
        label="Total Locations"
        value={totalLocations}
        color="blue"
      />
      <DashboardLocationStatCard
        label="Main Locations"
        value={locations?.length}
        color="green"
      />
      <DashboardLocationStatCard
        label="Sub Locations"
        value={totalLocations - locations?.length}
        color="purple"
      />
    </div>
  );
};

export default memo(DashboardLocationStatCards);
