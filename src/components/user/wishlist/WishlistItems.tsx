import { memo } from "react";
import { useLocale } from "next-intl";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { Product } from "@/types/product.type";
import { isArabicLocale } from "@/config/locales.config";
import WishlistProductCard from "./WishlistProductCard";

const WishlistItems = ({ wishlistItems }: { wishlistItems: Product[] }) => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="w-full">
      <MaxWidthWrapper className="w-full h-full px-0 md:px-0">
        <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 mt-5 auto-rows-fr">
          {wishlistItems?.map((item, itemIndex) => (
            <WishlistProductCard
              key={`wishlist-product_${item._id || itemIndex}`}
              item={item}
              isArabic={isArabic}
            />
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(WishlistItems);
