import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

type UserWishlistAndCartProps = {
  initialCounters?: {
    wishlistItemsCount: number;
    cartItemsCount: number | undefined;
  };
};

const Count = ({ count }: { count: number }) => {
  return (
    <span className="absolute -top-[12px] -right-[12px] bg-primary-500 w-[17px] h-[17px] rounded-full text-[10px] text-white-50 flex items-center justify-center">
      {count}
    </span>
  );
};

const UserWishlistAndCart = ({ initialCounters }: UserWishlistAndCartProps) => {
  return (
    <div className="w-auto flex items-center gap-5">
      <Link href={"/wishlist"}>
        <span className="cursor-pointer relative">
          <Heart className="w-5 h-5 text-primary-500 hover:fill-primary-500 transition-all" />
          <Count count={initialCounters?.wishlistItemsCount ?? 0} />
        </span>
      </Link>

      <Link href={"/cart"}>
        <span className="cursor-pointer relative">
          <ShoppingCart className="w-5 h-5 text-primary-500 hover:fill-primary-500 transition-all" />
          <Count count={initialCounters?.cartItemsCount ?? 0} />
        </span>
      </Link>
    </div>
  );
};

export default memo(UserWishlistAndCart);
