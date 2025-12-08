"use client";

import { Minus, Plus } from "lucide-react";

type Props = {
  quantity: number;
  isLoading?: boolean;
  handleChange: (type: "increment" | "decrement") => void;
};

export default function QuantityChanger({ quantity, isLoading, handleChange }: Props) {
  return (
    <div className="flex items-center justify-start gap-3 mt-2">
      <button
        onClick={() => handleChange("decrement")}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <Minus className="w-4 h-4 text-gray-700" />
      </button>

      <span className="text-lg font-medium">{quantity}</span>

      <button
        onClick={() => handleChange("increment")}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <Plus className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  );
}
