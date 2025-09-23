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
  onApplyFilter?: (from: number) => void;
  initialFrom?: number;
}

const RatingRange = ({
  setRatingFrom,
  onApplyFilter,
  initialFrom = 0,
}: RatingRangeProps) => {
  const defaultRange = { from: 0, to: 5 };

  const [fromValue, setFromValue] = useState(initialFrom);

  useEffect(() => {
    setFromValue(initialFrom);
  }, [initialFrom]);

  const handleApplyFilter = useCallback(() => {
    setRatingFrom(fromValue);
    onApplyFilter?.(fromValue);
  }, [fromValue, setRatingFrom, onApplyFilter]);

  const handleClearFilter = useCallback(() => {
    setFromValue(defaultRange.from);
    setRatingFrom(defaultRange.from);
    onApplyFilter?.(defaultRange.from);
  }, [setRatingFrom, onApplyFilter]);

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

        <PopoverContent className="w-80 p-4 space-y-6">
          <div className="w-full flex flex-col items-center gap-4">
            {/* From slider */}
            <div className="w-full flex justify-between items-center gap-4 mb-3">
                <Label className="text-normal font-normal">Minimum Rating</Label>
                <span className="flex items-center gap-1">
                  <span className="w-auto text-normal text-gray-600">
                    {fromValue.toFixed(1)}
                  </span>
                  <Star className="w-5 h-5 text-secondary-900" />
                </span>
              </div>
              <Slider
                value={[fromValue]}
                onValueChange={(val) => setFromValue(val[0])}
                max={5}
                min={0}
                step={0.1}
                className="w-full bg-grey-50/20"
              />
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
