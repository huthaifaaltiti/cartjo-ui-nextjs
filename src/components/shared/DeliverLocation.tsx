"use client";

import { memo } from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocations } from "@/hooks/react-query/useLocations";
import LocationSelector from "./LocationSelector";
import { useHome } from "@/contexts/HomeContext";

const DeliverLocation = () => {
  const t = useTranslations();
  const { data, isLoading, isError } = useLocations();
  const { selectedLocation, setSelectedLocation } = useHome();

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
  };

  if (isError) {
    return (
      <div className="text-red-500 text-sm">
        {t("errors.data.fetchingFailure")}
      </div>
    );
  }

  return (
    <div className="w-auto flex items-center justify-end gap-1">
      <MapPin className="h-6 w-auto" />
      <LocationSelector
        locations={data?.locations}
        isLoading={isLoading}
        handleLocationChange={handleLocationChange}
        selectedLocation={selectedLocation || ""}
      />
    </div>
  );
};

export default memo(DeliverLocation);
