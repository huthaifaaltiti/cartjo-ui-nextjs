import { Star } from "lucide-react";

export default function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= rating
              ? "text-primary-400 fill-primary-400"
              : "text-gray-300 fill-none"
          }
        />
      ))}
    </div>
  );
}
