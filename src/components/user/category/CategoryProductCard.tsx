import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/types/product.type";
import { isArabicLocale } from "@/config/locales.config";
import ProductVertCard from "@/components/shared/card/main/ProductVertCard";

const CategoryProductCard = ({ item: product }: { item: Product }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return <ProductVertCard item={product} isArabic={isArabic} />;
};

export default memo(CategoryProductCard);
