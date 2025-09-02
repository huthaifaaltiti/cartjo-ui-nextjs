import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import NoWishlistItems from "@/components/user/wishlist/NoWishlistItems";
import WishlistItems from "@/components/user/wishlist/WishlistItems";
import { fetchWishlistItems } from "@/hooks/react-query/useWishlistQuery";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";

const Page = async () => {
  const token = await getAccessTokenFromServerSession();

  let wishlistItems: Product[] = [];

  const response = await fetchWishlistItems({
    token,
    limit: PAGINATION_LIMITS.WISHLIST_ITEMS,
  });

  const products = response.data?.products ?? [];

  if (products?.length > 0) {
    wishlistItems = [...products];
  }

  if (wishlistItems?.length === 0) {
    return <NoWishlistItems />;
  }

  if (wishlistItems?.length > 0) {
    return <WishlistItems wishlistItems={wishlistItems} />;
  }
};

export default Page;
