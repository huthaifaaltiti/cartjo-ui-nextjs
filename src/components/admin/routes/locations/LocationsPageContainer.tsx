import { memo } from "react";
import { Location } from "@/types/location";
import DashboardLocationCards from "./DashboardLocationCards";
import DashboardLocationStatCards from "./DashboardLocationStatCards";
import DashboardUploadLocations from "./DashboardUploadLocations";

type LocationsPageContainerProps = {
  locations: Location[];
};

const LocationsPageContainer = ({ locations }: LocationsPageContainerProps) => {
  return (
    <div className="w-full h-full p-3">
      <DashboardUploadLocations />

      {locations && locations?.length > 0 && (
        <>
          <DashboardLocationStatCards locations={locations} />
          <DashboardLocationCards locations={locations} />
        </>
      )}
    </div>
  );
};

export default memo(LocationsPageContainer);
