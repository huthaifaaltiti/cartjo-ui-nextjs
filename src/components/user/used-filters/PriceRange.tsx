"use client";

import { memo, useState, useCallback, useEffect } from "react";
import { CircleDollarSign } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PriceRangeProps {
  setPriceFrom: (value: number) => void;
  setPriceTo: (value: number) => void;
  onApplyFilter?: (from: number, to: number) => void;
  initialFrom?: number;
  initialTo?: number;
}

const PriceRange = ({
  setPriceFrom,
  setPriceTo,
  onApplyFilter,
  initialFrom = 0,
  initialTo = 1000,
}: PriceRangeProps) => {
  const [customFrom, setCustomFrom] = useState<number>(initialFrom);
  const [customTo, setCustomTo] = useState<number>(initialTo);

  useEffect(() => {
    setCustomFrom(initialFrom);
    setCustomTo(initialTo);
  }, [initialFrom, initialTo]);

  const handleApplyFilter = useCallback(() => {
    setPriceFrom(customFrom);
    setPriceTo(customTo);
    onApplyFilter?.(customFrom, customTo);
  }, [customFrom, customTo, setPriceFrom, setPriceTo, onApplyFilter]);

  const handleClearFilter = useCallback(() => {
    setCustomFrom(0);
    setCustomTo(1000);
    setPriceFrom(0);
    setPriceTo(0);
    onApplyFilter?.(0, 0);
  }, [setPriceFrom, setPriceTo, onApplyFilter]);

  return (
    <div className="w-auto flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 h-8 px-3"
          >
            <CircleDollarSign className="w-4 h-4 text-secondary-900" />
            <span className="text-sm text-secondary-900">Price</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-60 p-3 space-y-2">
          <div className="w-full flex gap-2">
            <div className="w-1/2 flex flex-col gap-1">
              <Label className="text-xs text-gray-600">From (JOD)</Label>
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

            <div className="w-1/2 flex flex-col gap-1">
              <Label className="text-xs text-gray-600">To (JOD)</Label>
              <Input
                type="number"
                value={customTo}
                onChange={(e) => setCustomTo(Number(e.target.value))}
                placeholder="1000"
                min="0"
                max="100000"
                step="0.01"
                className="h-8 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleApplyFilter}
              variant="outline"
              size="sm"
              className="w-1/2 h-8 px-3"
            >
              Go
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

export default memo(PriceRange);
