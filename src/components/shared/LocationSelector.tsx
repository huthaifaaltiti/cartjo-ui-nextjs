"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { isArabicLocale } from "@/config/locales.config";
import { Location } from "@/types/location";

type LocationSelectorProps = {
  selectedLocation: string;
  locations: Location[] | undefined;
  isLoading: boolean;
  handleLocationChange: (value: string) => void;
};

const LocationSelector = ({
  selectedLocation,
  handleLocationChange,
  isLoading,
  locations,
}: LocationSelectorProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  const renderLocationsRecursive = (locs: Location[], level = 0) =>
    locs.flatMap((location) => {
      const label = isArabic ? location.name.ar : location.name.en;
      
      let prefix = "";
      if (level === 1) prefix = " - ";
      else if (level === 2) prefix = " -- ";
      else if (level > 2) prefix = "  - ".repeat(level - 1) + " --- ";
      
      const displayLabel = `${prefix}${label}`;

      const options = [
        <option 
          key={location._id} 
          value={location._id}
        >
          {displayLabel}
        </option>,
      ];

      if (location.subLocations?.length > 0) {
        options.push(
          ...renderLocationsRecursive(location.subLocations, level + 1)
        );
      }

      return options;
    });

  return (
    <select
      className="max-w-[6.5rem] w-auto text-text-primary-100 text-xs"
      value={selectedLocation}
      onChange={(e) => handleLocationChange(e.target.value)}
      disabled={isLoading || !locations?.length}
    >
      <option value="" disabled>
        {isLoading
          ? t("general.loadingStates.loading")
          : t("components.DeliverLocation.selectPlaceholder")}
      </option>

      {locations?.length ? (
        renderLocationsRecursive(locations)
      ) : (
        <option value="none" disabled>
          {t("general.data.noData")}
        </option>
      )}
    </select>
  );
};

export default memo(LocationSelector);