import { memo } from "react";
import { useLocale } from "next-intl";
import { Product } from "@/types/product.type";
import { isArabicLocale } from "@/config/locales.config";
import ProductVertCard from "@/components/shared/card/main/ProductVertCard";

interface Props {
  item: Product;
}

const CategoryProductCard = ({ item: product }: Props) => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return <ProductVertCard item={product} isArabic={isArabic} />;
};

export default memo(CategoryProductCard);
