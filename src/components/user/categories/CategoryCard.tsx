import { memo } from "react";
import { useLocale } from "next-intl";

import { isArabicLocale } from "@/config/locales.config";
import { Category } from "@/types/category";

import ImageWithFallback from "@/components/shared/ImageWithFallback";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="flex flex-col items-center gap-2 bg-transparent rounded-xl">
      {category.media?.url && (
        <div className="relative w-32 h-32 rounded-md overflow-hidden">
          <ImageWithFallback
            src={category?.media?.url}
            alt={category.name.en}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}

      <h3 className="text-[#030712] text-md font-bold capitalize text-center">
        {isArabic ? category?.name?.ar : category?.name?.en}
      </h3>
    </div>
  );
};

export default memo(CategoryCard);
