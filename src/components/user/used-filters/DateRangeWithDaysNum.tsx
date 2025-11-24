"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGeneralContext } from "@/contexts/General.context";

interface DateRangeProps {
  setCreatedFrom: (value: string) => void;
  setCreatedTo: (value: string) => void;
  setBeforeNumOfDays: (value: number) => void;
  onApplyFilter?: (
    filterType: "dateRange" | "daysBefore",
    createdFrom?: string,
    createdTo?: string,
    beforeNumOfDays?: number
  ) => void;
  initialCreatedFrom?: string;
  initialCreatedTo?: string;
  initialBeforeNumOfDays?: number;
}

const DateRangeWithDaysNum = ({
  setCreatedFrom,
  setCreatedTo,
  setBeforeNumOfDays,
  onApplyFilter,
  initialCreatedFrom = "",
  initialCreatedTo = "",
  initialBeforeNumOfDays = 0,
}: DateRangeProps) => {
  const t = useTranslations();
  const { dir } = useGeneralContext();

  const [filterType, setFilterType] = useState<"dateRange" | "daysBefore">(
    "dateRange"
  );
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [fromDate, setFromDate] = useState(initialCreatedFrom);
  const [toDate, setToDate] = useState(initialCreatedTo);
  const [daysBeforeValue, setDaysBeforeValue] = useState(
    initialBeforeNumOfDays
  );

  useEffect(() => {
    setFromDate(initialCreatedFrom);
    setToDate(initialCreatedTo);
    setDaysBeforeValue(initialBeforeNumOfDays);

    if (initialBeforeNumOfDays > 0) {
      setFilterType("daysBefore");
    } else if (initialCreatedFrom || initialCreatedTo) {
      setFilterType("dateRange");
    }
  }, [initialCreatedFrom, initialCreatedTo, initialBeforeNumOfDays]);

  useEffect(() => {
    if (initialCreatedFrom || initialCreatedTo || initialBeforeNumOfDays > 0) {
      setIsActiveFilter(true);
    } else {
      setIsActiveFilter(false);
    }
  }, [initialCreatedFrom, initialCreatedTo, initialBeforeNumOfDays]);

  const handleApplyFilter = useCallback(() => {
    if (filterType === "dateRange") {
      setCreatedFrom(fromDate);
      setCreatedTo(toDate);
      setBeforeNumOfDays(0); // Clear days before when using date range
      onApplyFilter?.("dateRange", fromDate, toDate, 0);
    } else {
      setBeforeNumOfDays(daysBeforeValue);
      setCreatedFrom(""); // Clear date range when using days before
      setCreatedTo("");
      onApplyFilter?.("daysBefore", "", "", daysBeforeValue);
    }
  }, [
    filterType,
    fromDate,
    toDate,
    daysBeforeValue,
    setCreatedFrom,
    setCreatedTo,
    setBeforeNumOfDays,
    onApplyFilter,
  ]);

  const handleClearFilter = useCallback(() => {
    setFromDate("");
    setToDate("");
    setDaysBeforeValue(0);
    setCreatedFrom("");
    setCreatedTo("");
    setBeforeNumOfDays(0);
    onApplyFilter?.("dateRange", "", "", 0);
  }, [setCreatedFrom, setCreatedTo, setBeforeNumOfDays, onApplyFilter]);

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Get today's date in YYYY-MM-DD format for max attribute
  const todayString = new Date().toISOString().split("T")[0];

  return (
    <div className="w-auto flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 h-8 px-3 ${
              isActiveFilter ? "border-[2px] border-primary-500" : ""
            }`}
          >
            <Calendar className="w-4 h-4 text-secondary-900" />
            <span className="text-sm text-secondary-900">
              {t("components.filters.DateRange.dateFilter")}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-4 space-y-6">
          {/* Filter Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {t("components.filters.DateRange.filterType")}
            </Label>
            <RadioGroup
              dir={dir}
              value={filterType}
              onValueChange={(value: "dateRange" | "daysBefore") =>
                setFilterType(value)
              }
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="dateRange" id="dateRange" />
                <Label
                  htmlFor="dateRange"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  {t("components.filters.DateRange.selectDateRange")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="daysBefore" id="daysBefore" />
                <Label
                  htmlFor="daysBefore"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  {t("components.filters.DateRange.selectDaysBefore")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range Inputs */}
          {filterType === "dateRange" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate" className="text-sm font-normal">
                  {t("components.filters.DateRange.fromDate")}
                </Label>
                <Input
                  dir={dir}
                  id="fromDate"
                  type="date"
                  value={formatDateForInput(fromDate)}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={todayString}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate" className="text-sm font-normal">
                  {t("components.filters.DateRange.toDate")}
                </Label>
                <Input
                  dir={dir}
                  id="toDate"
                  type="date"
                  value={formatDateForInput(toDate)}
                  onChange={(e) => setToDate(e.target.value)}
                  max={todayString}
                  min={formatDateForInput(fromDate)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Days Before Input */}
          {filterType === "daysBefore" && (
            <div className="space-y-2">
              <Label htmlFor="daysBefore" className="text-sm font-normal">
                {t("components.filters.DateRange.daysBeforeToday")}
              </Label>
              <Input
                dir={dir}
                id="daysBefore"
                type="number"
                min="1"
                max="365"
                value={daysBeforeValue || ""}
                onChange={(e) =>
                  setDaysBeforeValue(Number(e.target.value) || 0)
                }
                placeholder={t("components.filters.DateRange.enterDays")}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                {t("components.filters.DateRange.daysBeforeHelper", {
                  date: new Date(
                    new Date().setDate(new Date().getDate() - daysBeforeValue)
                  ).toLocaleDateString("en-US", {
                    weekday: "long", // e.g., Monday
                    year: "numeric",
                    month: "long",
                    day: "numeric", // e.g., September 23, 2025
                  }),
                  days: daysBeforeValue,
                })}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleApplyFilter}
              variant="outline"
              size="sm"
              className="w-1/2 h-8 px-3"
            >
              {t("components.filters.actions.apply")}
            </Button>
            <Button
              onClick={handleClearFilter}
              variant="outline"
              size="sm"
              className="w-1/2 h-8 px-3"
            >
              {t("components.filters.actions.clear")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(DateRangeWithDaysNum);
