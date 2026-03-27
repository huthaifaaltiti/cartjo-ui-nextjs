interface NumericRatingProps {
  rating: number;
  max?: number;
}

export default function NumericRating({ rating, max = 5 }: NumericRatingProps) {
  return (
    <div className="flex items-baseline gap-1 font-medium">
      <span className="text-xl font-bold text-black-700">
        {rating.toFixed(1)}
      </span>
      <span className="text-sm text-gray-400">/ {max}</span>
    </div>
  );
}
