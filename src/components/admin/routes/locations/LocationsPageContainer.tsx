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
      {/* Upload locations */}
      <DashboardUploadLocations />

      {locations && locations?.length > 0 && (
        <>
          {/* Stats Section */}
          <DashboardLocationStatCards locations={locations} />

          {/* Locations Display */}
          <DashboardLocationCards locations={locations} />
        </>
      )}
    </div>
  );
};

export default memo(LocationsPageContainer);
