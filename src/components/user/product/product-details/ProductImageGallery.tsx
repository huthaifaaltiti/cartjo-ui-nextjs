import { useState } from "react";
import Image from "next/image";
import WishlistButton from "@/components/shared/card/WishlistButton";
import { Product, VariantServer } from "@/types/product.type";

interface Props {
  product: Product;
  variant: VariantServer;
  isWishlisted: boolean;
  isWishlisting: boolean;
  onToggleWishlist: () => void;
}

const ProductImageGallery = ({
  product,
  variant,
  isWishlisted,
  isWishlisting,
  onToggleWishlist,
}: Props) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const allImages = [variant.mainImage, ...(variant.images ?? [])];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative bg-white rounded-2xl border h-[450px] flex items-center justify-center">
        <WishlistButton
          isWishListed={isWishlisted}
          isLoading={isWishlisting}
          onClick={onToggleWishlist}
          className={`absolute top-2 ltr:right-2 rtl:left-2 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isWishlisted
              ? "bg-primary-50 shadow-md sm:scale-105 scale-100"
              : "bg-white-50/80 hover:bg-white-50 shadow-sm hover:shadow-md"
          } hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
        />

        <Image
          src={allImages[selectedImageIdx]?.url || "/assets/image/png/default-fallback-image.png"}
          fill
          alt={product.name.en}
          className="object-contain p-5"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 flex-wrap">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImageIdx(i)}
            className={`w-[68px] h-[68px] rounded-xl border-2 bg-white-50 overflow-hidden p-1 flex-shrink-0 transition-all hover:scale-105 ${
              selectedImageIdx === i
                ? "border-indigo-500 ring-1 ring-indigo-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={
                imageErrors[i]
                  ? "/assets/image/png/default-fallback-image.png"
                  : img.url
              }
              alt={variant.description.en}
              width={60}
              height={60}
              className="w-full h-full object-contain"
              onError={() => setImageErrors((prev) => ({ ...prev, [i]: true }))}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
