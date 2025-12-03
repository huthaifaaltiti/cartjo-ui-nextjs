import { memo } from "react";
import { Product } from "@/types/product.type";
import ProductVertCard from "@/components/shared/card/main/ProductVertCard";

const ShowcaseProductVertCard = ({
  item,
  isArabic,
}: {
  item: Product;
  isArabic: boolean;
}) => {
  return <ProductVertCard item={item} isArabic={isArabic} />;
};

export default memo(ShowcaseProductVertCard);
