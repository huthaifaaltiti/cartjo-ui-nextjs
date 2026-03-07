import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StarRow({
  rating,
  count,
}: {
  rating: number;
  count: number;
}) {
  const t = useTranslations("components.StarRow");
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= rating
              ? "text-indigo-400 fill-indigo-400"
              : "text-gray-300 fill-none"
          }
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">
        ({count} {t("reviews")})
      </span>
    </div>
  );
}
