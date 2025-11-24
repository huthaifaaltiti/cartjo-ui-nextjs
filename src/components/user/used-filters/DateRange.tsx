"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGeneralContext } from "@/contexts/General.context";

interface DateRangeProps {
  setCreatedFrom: (value: string) => void;
  setCreatedTo: (value: string) => void;
  onApplyFilter?: (createdFrom?: string, createdTo?: string) => void;
  initialCreatedFrom?: string;
  initialCreatedTo?: string;
}

const DateRange = ({
  setCreatedFrom,
  setCreatedTo,
  onApplyFilter,
  initialCreatedFrom = "",
  initialCreatedTo = "",
}: DateRangeProps) => {
  const t = useTranslations();
  const { dir } = useGeneralContext();

  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [fromDate, setFromDate] = useState(initialCreatedFrom);
  const [toDate, setToDate] = useState(initialCreatedTo);

  useEffect(() => {
    setFromDate(initialCreatedFrom);
    setToDate(initialCreatedTo);
  }, [initialCreatedFrom, initialCreatedTo]);

  useEffect(() => {
    if (initialCreatedFrom || initialCreatedTo) {
      setIsActiveFilter(true);
    } else {
      setIsActiveFilter(false);
    }
  }, [initialCreatedFrom, initialCreatedTo]);

  const handleApplyFilter = useCallback(() => {
    setCreatedFrom(fromDate);
    setCreatedTo(toDate);
    onApplyFilter?.(fromDate, toDate);
  }, [fromDate, toDate, setCreatedFrom, setCreatedTo, onApplyFilter]);

  const handleClearFilter = useCallback(() => {
    setFromDate("");
    setToDate("");
    setCreatedFrom("");
    setCreatedTo("");
    onApplyFilter?.("", "");
  }, [setCreatedFrom, setCreatedTo, onApplyFilter]);

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
              {t("components.filters.DateRange.title")}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-4 space-y-6">
          {/* Filter Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              {t("components.filters.DateRange.desc")}
            </Label>
          </div>
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

export default memo(DateRange);
