import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const UserWishlistAndCart = () => {
  return (
    <div className="w-auto flex items-center gap-5">
      <Link href={"/wishlist"}>
        <span className="cursor-pointer">
          <Heart className="w-5 h-5 text-primary-500 hover:fill-primary-500 transition-all" />
        </span>
      </Link>

      <Link href={"/cart"}>
        <span className="cursor-pointer">
          <ShoppingCart className="w-5 h-5 text-primary-500 hover:fill-primary-500 transition-all" />
        </span>
      </Link>
    </div>
  );
};

export default memo(UserWishlistAndCart);
