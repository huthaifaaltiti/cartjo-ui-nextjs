import { ShoppingCart } from "lucide-react";
import LoadingProductButton from "@/components/shared/loaders/LoadingProduct";
import LoadingShimmerEffect from "@/components/shared/LoadingShimmerEffect";

export default function AddToCartButton({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full px-1 py-3 mt-auto rounded-lg font-semibold flex items-center justify-center gap-2 text-sm ${
        isLoading
          ? "bg-primary-400 text-white-50"
          : "bg-gradient-to-r from-primary-500 to-primary-600 text-white-50 hover:scale-105 transition-all"
      }`}
    >
      {isLoading && <LoadingShimmerEffect />}

      {isLoading ? (
        <LoadingProductButton color="#fff" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {isLoading ? "ADDING..." : "ADD TO CART"}
    </button>
  );
}
