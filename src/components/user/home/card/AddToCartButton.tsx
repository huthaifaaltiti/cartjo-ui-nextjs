import { ShoppingCart } from "lucide-react";
import LoadingProductButton from "@/components/shared/loaders/LoadingProduct";
import LoadingShimmerEffect from "@/components/shared/LoadingShimmerEffect";

interface AddToCartButtonProps {
  isLoading?: boolean;
  onClick: () => void;
}

export default function AddToCartButton({
  isLoading = false,
  onClick,
}: AddToCartButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        w-full px-0 py-2 sm:px-1 sm:py-3 mt-auto rounded-lg font-semibold text-xs sm:text-sm
        flex items-center justify-center gap-2 relative
        transition-all
        ${
          isLoading
            ? "bg-primary-400 text-white-50 cursor-not-allowed"
            : "bg-gradient-to-r from-primary-500 to-primary-600 text-white-50 hover:scale-105"
        }
      `}
    >
      {isLoading && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <LoadingShimmerEffect />
        </div>
      )}

      {isLoading ? (
        <LoadingProductButton color="#fff" />
      ) : (
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
      )}

      {isLoading ? "ADDING..." : "ADD TO CART"}
    </button>
  );
}
