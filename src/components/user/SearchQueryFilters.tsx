import { memo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DateRange from "./used-filters/DateRange";
import RatingRange from "./used-filters/RatingRange";
import PriceRange from "./used-filters/PriceRange";

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
    <div className="w-full flex items-center justify-between gap-4 py-1">
      <div className="w-auto flex items-center gap-4">
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
        <DateRange
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
        className="text-text-primary-100 hover:text-text-primary-200 transition-all"
      >
        {t("components.filters.actions.clearAll")}
      </Button>
    </div>
  );
};

export default memo(SearchQueryFilters);
