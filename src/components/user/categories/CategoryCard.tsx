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
    <div className="!w-full !h-full flex flex-col items-center gap-2 bg-transparent rounded-xl">
      {category?.media?.ar?.url && category?.media?.en?.url && (
        <div className="relative w-full h-full rounded-md overflow-hidden">
          <ImageWithFallback
            src={isArabic ? category?.media?.ar?.url : category?.media?.en?.url}
            alt={
              (isArabic ? category?.name?.ar : category?.name?.en) ||
              "category image"
            }
            width={130}
            height={180}
            useFill={false}
            quality={95} 
            priority={true}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(CategoryCard);
