import { memo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DateRangeWithDaysNum from "./used-filters/DateRangeWithDaysNum";
import RatingRange from "./used-filters/RatingRange";
import PriceRange from "./used-filters/PriceRange";
import assets from "@public/assets/assets.json";

interface FiltersProps {
  priceFrom: number;
  priceTo: number;
  ratingFrom: number;
  createdFrom: string;
  createdTo: string;
  beforeNumOfDays: number;

  setPriceFrom: (val: number) => void;
  setPriceTo: (val: number) => void;
  setRatingFrom: (val: number) => void;
  setCreatedFrom: (val: string) => void;
  setCreatedTo: (val: string) => void;
  setBeforeNumOfDays: (val: number) => void;

  onApplyPriceFilter: (from: number, to: number) => void;
  onApplyRangeFilter: (from: number) => void;
  onApplyDateFilter: (
    filterType: "dateRange" | "daysBefore",
    createdFromValue?: string,
    createdToValue?: string,
    beforeNumOfDaysValue?: number
  ) => void;
  onClearFilters: () => void;
}

const SearchQueryFilters = ({
  priceFrom,
  priceTo,
  ratingFrom,
  createdFrom,
  createdTo,
  beforeNumOfDays,
  setPriceFrom,
  setPriceTo,
  setRatingFrom,
  setCreatedFrom,
  setCreatedTo,
  setBeforeNumOfDays,
  onApplyPriceFilter,
  onApplyRangeFilter,
  onApplyDateFilter,
  onClearFilters,
}: FiltersProps) => {
  const t = useTranslations();

  return (
    <div className="w-full flex items-first justify-between gap-2 py-1">
      <div className="w-auto flex items-center gap-2 flex-wrap">
        <PriceRange
          setPriceFrom={setPriceFrom}
          setPriceTo={setPriceTo}
          onApplyFilter={onApplyPriceFilter}
          initialFrom={priceFrom}
          initialTo={priceTo}
        />
        <RatingRange
          setRatingFrom={setRatingFrom}
          onApplyFilter={onApplyRangeFilter}
          initialFrom={ratingFrom}
        />
        <DateRangeWithDaysNum
          setCreatedFrom={setCreatedFrom}
          setCreatedTo={setCreatedTo}
          setBeforeNumOfDays={setBeforeNumOfDays}
          onApplyFilter={onApplyDateFilter}
          initialCreatedFrom={createdFrom}
          initialCreatedTo={createdTo}
          initialBeforeNumOfDays={beforeNumOfDays}
        />
      </div>

      {/* Clear All Filters */}
      <Button
        variant="outline"
        size="sm"
        onClick={onClearFilters}
        className="flex items-center gap-2 text-text-primary-100 hover:text-text-primary-100 transition-all"
      >
        <img
          src={assets.image.svg.clear_filters_grey}
          alt="clear filters"
          className="w-4 h-4"
        />

        {t("components.filters.actions.clearAll")}
      </Button>
    </div>
  );
};

export default memo(SearchQueryFilters);
