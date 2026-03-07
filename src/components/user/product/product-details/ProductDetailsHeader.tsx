import StarRow from "../../../shared/StarRow";
import { Product } from "@/types/product.type";

interface Props {
  product: Product;
  isArabic: boolean;
}

const ProductDetailsHeader = ({ product, isArabic }: Props) => {
  const title = isArabic ? product?.name?.ar : product?.name?.en;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-extrabold text-gray-900 first-letter-capital">
        {title}
      </h1>
      <StarRow rating={product?.ratingsAverage} count={product?.ratingsCount} />
    </div>
  );
};

export default ProductDetailsHeader;
