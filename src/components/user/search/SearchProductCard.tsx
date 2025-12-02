import { memo } from "react";
import { useLocale } from "next-intl";
import { Product } from "@/types/product.type";
import { isArabicLocale } from "@/config/locales.config";
import ShowcaseProductVertCard from "../home/ShowcaseProductVertCard";

const SearchProductCard = ({ item: product }: { item: Product }) => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return <ShowcaseProductVertCard item={product} isArabic={isArabic} />;
};

export default memo(SearchProductCard);
