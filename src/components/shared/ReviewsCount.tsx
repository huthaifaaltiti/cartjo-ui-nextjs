import { useTranslations } from "next-intl";

export default function ReviewsCount({ count }: { count: number }) {
  const t = useTranslations("components.ReviewsCount");
  return (
    <span className="text-xs text-gray-500 ml-1">
      ({count} {t(`${count === 1 ? "review" : "reviews"}`)})
    </span>
  );
}
