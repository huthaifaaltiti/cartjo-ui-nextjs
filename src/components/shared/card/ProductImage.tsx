import ImageWithFallback from "@/components/shared/ImageWithFallback";
import LoadingShimmerEffect from "@/components/shared/LoadingShimmerEffect";

interface ProductImageProps {
  src: string;
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
  return (
    <div className="h-full w-full relative">
      <div className="h-full w-full rounded-xl overflow-hidden bg-white-500 relative">
        {(isLoading || !src) && <LoadingShimmerEffect />}

        <ImageWithFallback
          src={src}
          alt={alt}
          className={`object-contain w-full h-full transition-all duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          } ${isLoading ? "scale-110 blur-[1px]" : ""}`}
        />
      </div>
    </div>
  );
}
