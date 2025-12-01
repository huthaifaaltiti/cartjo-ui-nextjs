import { Star } from "lucide-react";

export default function ProductRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "text-primary-400 fill-primary-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
