"use client";

import * as React from "react";
import { ChevronDownIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Calendar24Props = {
  value?: Date | string | null;
  onChange: (value: Date | null) => void;
};

export function Calendar24({ value, onChange }: Calendar24Props) {
  const t = useTranslations();

  // Ensure we always work with a Date if possible
  const dateValue =
    value instanceof Date ? value : value ? new Date(value) : null;

  const timeOnly = dateValue
    ? dateValue.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "10:30:00";

  const dateOnly = dateValue
    ? dateValue.toLocaleDateString("en-CA") // en-CA format = YYYY-MM-DD (perfect for inputs & calendar)
    : t("general.others.selectDate");

  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(timeOnly);

  const handleDateSelect = (selectedDate?: Date) => {
    if (!selectedDate) {
      onChange(null);
      return;
    }

    const [hours, minutes, seconds] = time?.split(":").map(Number);
    selectedDate.setHours(hours, minutes, seconds || 0);

    onChange(selectedDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (dateValue) {
      const [hours, minutes, seconds] = newTime.split(":").map(Number);
      const updatedDate = new Date(dateValue);
      updatedDate.setHours(hours, minutes, seconds || 0);
      onChange(updatedDate);
    }
  };

  const handleClear = () => {
    setTime("00:00:00");
    onChange(null);
    setOpen(false);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          {t("general.others.date")}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {dateOnly}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue || undefined}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />

            {/* ✅ Clear Button */}
            {dateValue && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-red-500 hover:text-red-600"
                onClick={handleClear}
              >
                <X className="w-4 h-4 mr-1" />
                {t("general.others.clearDate")}
              </Button>
            )}
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          {t("general.others.time")}
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
