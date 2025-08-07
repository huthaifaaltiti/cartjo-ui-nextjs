import { memo } from "react";
import { useLocale } from "next-intl";

import { isArabicLocale } from "@/config/locales.config";
import { Category } from "@/types/category.type";

import ImageWithFallback from "@/components/shared/ImageWithFallback";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="flex flex-col items-center gap-2 bg-transparent rounded-xl">
      {category?.media?.ar?.url && category?.media?.en?.url && (
        <div className="relative w-20 h-28 rounded-md overflow-hidden">
          <ImageWithFallback
            src={isArabic ? category?.media?.ar?.url : category?.media?.en?.url}
            alt={
              (isArabic ? category?.name?.ar : category?.name?.en) ||
              "category image"
            }
            fill={true}
            className="object-fill"
            sizes="96px"
          />
        </div>
      )}
    </div>
  );
};

export default memo(CategoryCard);
