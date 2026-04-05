import ImageWithFallback from "@/components/shared/ImageWithFallback";
import ProductImageSkeleton from "./ProductImageSkeleton";
import Image from "next/image";
import { DEFAULT_FALLBACK_IMAGE } from "@/config/media.config";

interface ProductImageProps {
  src?: string;
  alt: string;
  isHovered: boolean;
  isLoading: boolean;
}

export default function ProductImage({
  src,
  alt,
  isHovered,
  isLoading,
}: ProductImageProps) {
  if (isLoading && !src) {
    return <ProductImageSkeleton />;
  }

  if (!src) {
    return (
      <Image
        width={400}
        height={400}
        src={DEFAULT_FALLBACK_IMAGE}
        alt="Fallback product image"
        className={`rounded-lg w-full h-full`}
      />
    );
  }

  return (
    <div className="h-full w-full relative">
      <div className="h-full w-full rounded-xl overflow-hidden bg-white relative">
        <ImageWithFallback
          src={src}
          alt={alt ?? "Product Image alternative text"}
          className={`object-contain w-full h-full transition-all duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>
    </div>
  );
}
