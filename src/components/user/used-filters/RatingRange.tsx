"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { Star } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RatingRangeProps {
  setRatingFrom: (value: number) => void;
  setRatingTo: (value: number) => void;
  onApplyFilter?: (from: number, to: number) => void;
  initialFrom?: number;
  initialTo?: number;
}

const RatingRange = ({
  setRatingFrom,
  setRatingTo,
  onApplyFilter,
  initialFrom = 0,
  initialTo = 5,
}: RatingRangeProps) => {
  const defaultRange: [number, number] = [0, 5];
  const [ratingRange, setRatingRange] = useState<number[]>([
    initialFrom,
    initialTo,
  ]);

  console.log({ ratingRange });

  // sync props → local state
  useEffect(() => {
    setRatingRange([initialFrom, initialTo]);
  }, [initialFrom, initialTo]);

  const handleRangeChange = useCallback((values: number[]) => {
    setRatingRange(values);
  }, []);

  const handleApplyFilter = useCallback(() => {
    const [from, to] = ratingRange;
    setRatingFrom(from);
    setRatingTo(to);
    onApplyFilter?.(from, to);
  }, [ratingRange, setRatingFrom, setRatingTo, onApplyFilter]);

  const handleClearFilter = useCallback(() => {
    setRatingRange(defaultRange);
    setRatingFrom(defaultRange[0]);
    setRatingTo(defaultRange[1]);
    onApplyFilter?.(defaultRange[0], defaultRange[1]);
  }, [setRatingFrom, setRatingTo, onApplyFilter]);

  return (
    <div className="w-auto flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-8 px-3"
          >
            <Star className="w-4 h-4 text-secondary-900" />
            <span className="text-sm text-secondary-900">Rating</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Rating Range</Label>
              <span className="text-xs text-gray-600">
                {ratingRange[0].toFixed(1)} – {ratingRange[1].toFixed(1)} stars
              </span>
            </div>

            <div className="px-2">
              <Slider
                value={ratingRange}
                onValueChange={handleRangeChange}
                max={5}
                min={0.0}
                step={0.1}
                className="w-full bg-grey-50/20"
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>0 stars</span>
              <span>5 stars</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleApplyFilter}
              variant="outline"
              size="sm"
              className="w-1/2 h-8 px-3"
            >
              Apply
            </Button>
            <Button
              onClick={handleClearFilter}
              variant="outline"
              size="sm"
              className="w-1/2 h-8 px-3"
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(RatingRange);
