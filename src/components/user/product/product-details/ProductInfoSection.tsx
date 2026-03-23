import { Product, VariantAttribute, VariantServer } from "@/types/product.type";
import VariantDetailsSelector from "./VariantDetailsSelector";
import ProductDetailsHeader from "./ProductDetailsHeader";
import ProductDetailsPrice from "./ProductDetailsPrice";
import ProductDetailsAttributes from "./ProductDetailsAttributes";
import ProductDetailsColors from "./ProductDetailsColors";
import QuantitySelector from "@/components/shared/QuantitySelector";
import ProductDetailsAddToCartButton from "./ProductDetailsAddToCartButton";
import ProductDetailsSubtotal from "./ProductDetailsSubtotal";
import VariantDescription from "./VariantDescription";
import { ProductVariantAttributeKey } from "@/enums/productVariantAttributeKey.enum";

interface Props {
  isArabic: boolean;
  product: Product;
  variant: VariantServer;
  selectedVariantIdx: number;
  onVariantChange: (idx: number) => void;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onAddToCart: () => void;
  isAddToCartLoading: boolean;
  addedToCart: boolean;
}

const getAttrs = (attrs: VariantAttribute[], key: ProductVariantAttributeKey) =>
  attrs.filter((a) => a.key === key).map((a) => a.value);

const getAttr = (attrs: VariantAttribute[], key: ProductVariantAttributeKey) =>
  attrs.find((a) => a.key === key)?.value ?? "—";

const ProductInfoSection = ({
  isArabic,
  product,
  variant,
  selectedVariantIdx,
  onVariantChange,
  quantity,
  setQuantity,
  onAddToCart,
  isAddToCartLoading,
  addedToCart,
}: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <ProductDetailsHeader product={product} isArabic={isArabic} />

      <VariantDetailsSelector
        variants={product.variants}
        selectedVariantIdx={selectedVariantIdx}
        onVariantChange={onVariantChange}
        isArabic={isArabic}
      />

      <ProductDetailsPrice
        price={variant.price}
        priceAfterDiscount={variant.priceAfterDiscount}
        currency={variant.currency}
        discountRate={variant.discountRate}
        isArabic={isArabic}
      />

      <ProductDetailsAttributes
        size={getAttr(variant.attributes, ProductVariantAttributeKey.SIZE)}
        sellingType={getAttr(
          variant.attributes,
          ProductVariantAttributeKey.SELLING_TYPE,
        )}
        sku={variant.sku}
      />

      <ProductDetailsColors
        colors={getAttrs(variant.attributes, ProductVariantAttributeKey.COLOR)}
      />

      <VariantDescription isArabic={isArabic} variant={variant} />

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          max={variant.availableCount}
        />

        <ProductDetailsAddToCartButton
          onClick={onAddToCart}
          loading={isAddToCartLoading}
          added={addedToCart}
          disabled={!variant.isAvailable}
        />
      </div>

      <ProductDetailsSubtotal
        quantity={quantity}
        price={variant.priceAfterDiscount}
        currency={variant.currency}
        isArabic={isArabic}
      />
    </div>
  );
};

export default ProductInfoSection;
