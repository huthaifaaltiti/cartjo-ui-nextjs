import { Star } from "lucide-react";

interface ProductRatingProps {
  rating?: number;
}

export default function ProductRating({ rating = 0 }: ProductRatingProps) {
  const filledStars = Math.floor(rating);

  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const isFilled = i < filledStars;

          return (
            <Star
              key={i}
              className={`sm:w-4 sm:h-4 w-3 h-3 ${
                isFilled ? "text-primary-400 fill-primary-400" : "text-gray-200"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
