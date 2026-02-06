import { Heart } from "lucide-react";
import LoadingProductButton from "@/components/shared/loaders/LoadingProduct";

interface WishlistButtonProps {
  isWishListed: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function WishlistButton({
  isWishListed,
  isLoading,
  onClick,
}: WishlistButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`absolute top-2 left-2 z-20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
        isWishListed
          ? "bg-primary-50 shadow-md sm:scale-105 scale-100"
          : "bg-white-50/80 hover:bg-white-50 shadow-sm hover:shadow-md"
      } hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {isLoading ? (
        <LoadingProductButton />
      ) : (
        <Heart
          className={`sm:w-5 sm:h-5 w-4 h-4 ${
            isWishListed
              ? "text-primary-500 fill-primary-500"
              : "text-gray-600 hover:text-primary-500"
          }`}
        />
      )}
    </button>
  );
}
