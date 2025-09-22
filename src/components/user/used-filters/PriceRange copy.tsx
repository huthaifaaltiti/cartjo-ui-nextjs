"use client";

import { memo, useState, useCallback } from "react";
import { CircleDollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PriceRangeProps {
  setPriceFrom: (value: number) => void;
  setPriceTo: (value: number) => void;
  onApplyFilter?: (from: number, to: number) => void;
}

const PRICE_RANGES = [
  { label: "0 - 50", from: 0, to: 50 },
  { label: "50 - 100", from: 50, to: 100 },
  { label: "100 - 200", from: 100, to: 200 },
  { label: "200 - 500", from: 200, to: 500 },
  { label: "500 - 1000", from: 500, to: 1000 },
  { label: "1000+", from: 1000, to: 10000 },
  { label: "Custom", from: 0, to: 0 },
];

const PriceRange = ({
  setPriceFrom,
  setPriceTo,
  onApplyFilter,
}: PriceRangeProps) => {
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [customFrom, setCustomFrom] = useState<number>(0);
  const [customTo, setCustomTo] = useState<number>(1000);

  const handleRangeChange = useCallback((value: string) => {
    setSelectedRange(value);

    if (value !== "Custom") {
      const range = PRICE_RANGES.find((r) => `${r.from}-${r.to}` === value);
      if (range) {
        setCustomFrom(range.from);
        setCustomTo(range.to);
      }
    }
  }, []);

  const handleApplyFilter = useCallback(() => {
    setPriceFrom(customFrom);
    setPriceTo(customTo);
    onApplyFilter?.(customFrom, customTo);
  }, [customFrom, customTo, setPriceFrom, setPriceTo, onApplyFilter]);

  const handleClearFilter = useCallback(() => {
    setSelectedRange("");
    setCustomFrom(0);
    setCustomTo(1000);
    setPriceFrom(0);
    setPriceTo(0);
    onApplyFilter?.(0, 0);
  }, [setPriceFrom, setPriceTo, onApplyFilter]);

  return (
    <div className="w-auto flex items-center gap-2">
      <Select onValueChange={handleRangeChange} value={selectedRange}>
        <SelectTrigger className="w-[180px] text-sm shadow-none flex items-center gap-2">
          <CircleDollarSign className="w-4 h-4 text-secondary-900" />
          <span className="text-secondary-900 text-sm">Price</span>
          <SelectValue placeholder="Select range" />
        </SelectTrigger>

        <SelectContent className="p-2 space-y-2">
          {PRICE_RANGES.map((range) => (
            <SelectItem
              key={`${range.from}-${range.to}`}
              value={
                range.label === "Custom"
                  ? "Custom"
                  : `${range.from}-${range.to}`
              }
            >
              {range.label}
            </SelectItem>
          ))}

          {selectedRange === "Custom" && (
            <div className="flex flex-col gap-2 p-2 border-t pt-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-gray-600">From ($)</Label>
                <Input
                  type="number"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="h-8 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs text-gray-600">To ($)</Label>
                <Input
                  type="number"
                  value={customTo}
                  onChange={(e) => setCustomTo(Number(e.target.value))}
                  placeholder="1000"
                  min="0"
                  step="0.01"
                  className="h-8 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleApplyFilter}
                  size="sm"
                  className="h-8 px-3"
                >
                  Go
                </Button>
                <Button
                  onClick={handleClearFilter}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(PriceRange);
