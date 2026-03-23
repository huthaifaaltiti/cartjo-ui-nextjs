import { Star } from "lucide-react";

interface RatingStatsProps {
  ratingAverage?: number;
  ratingCount?: number;
}

export default function ItemRatingStats({
  ratingAverage = 0,
  ratingCount = 0,
}: RatingStatsProps) {
  if (ratingCount === null || ratingCount === undefined) return null;

  const formattedAverage = ratingAverage.toFixed(1);
  const formattedCount =
    ratingCount >= 1000
      ? `${(ratingCount / 1000).toFixed(1)}k+`
      : `${ratingCount}+`;

  return (
    <div className="flex items-center gap-1 text-xs sm:text-sm">
      <Star className="w-3.5 h-3.5 text-primary-400 fill-primary-400" />
      <span className="font-semibold text-gray-900">{formattedAverage}</span>
      <span className="text-gray-400">({formattedCount})</span>
    </div>
  );
}
