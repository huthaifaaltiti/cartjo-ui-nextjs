import { Product } from "@/types/product.type";
import { useLocale } from "next-intl";
import { memo } from "react";
import { isArabicLocale } from "@/config/locales.config";
import ProductVertCard from "@/components/shared/card/main/ProductVertCard";

interface RecProductCardProps {
  product: Product;
}
const RecProductCard = ({ product }: RecProductCardProps) => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return <ProductVertCard item={product} isArabic={isArabic} />;
};

export default memo(RecProductCard);
