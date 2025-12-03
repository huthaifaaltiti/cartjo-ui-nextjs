import { memo } from "react";
import { Product } from "@/types/product.type";
import ProductRowCard from "@/components/shared/card/main/ProductRowCard";

const ShowcaseProductRowCard = ({
  item,
  isArabic = false,
}: {
  item: Product;
  isArabic: boolean;
}) => {
  return <ProductRowCard item={item} isArabic={isArabic} />;
};

export default memo(ShowcaseProductRowCard);
