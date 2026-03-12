import NumericRating from "@/components/shared/NumericRating";
import StarRow from "../../../shared/StarRow";
import { Product } from "@/types/product.type";
import ReviewsCount from "@/components/shared/ReviewsCount";

interface Props {
  product: Product;
  isArabic: boolean;
}

const ProductDetailsHeader = ({ product, isArabic }: Props) => {
  const title = isArabic ? product?.name?.ar : product?.name?.en;
  const rating = product?.ratingsAverage ?? 0;
  const count = product?.ratingsCount ?? 0;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-extrabold text-gray-900 first-letter-capital">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <NumericRating rating={rating} />
        <StarRow rating={rating} />
        <ReviewsCount count={count} />
      </div>
    </div>
  );
};

export default ProductDetailsHeader;
