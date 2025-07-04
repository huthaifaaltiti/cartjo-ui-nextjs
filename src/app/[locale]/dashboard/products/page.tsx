import { Product } from "@/types/product.type";

import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { fetchProducts } from "@/hooks/react-query/useProductsQuery";
import ProductsPage from "@/components/admin/routes/products/ProductsPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  let products: Product[] = [];

  if (accessToken) {
    const prodsResp = await fetchProducts({
      token: accessToken,
      limit: PAGINATION_LIMITS.INITIAL_TOTAL_USERS_LIMIT,
    });

    products = prodsResp?.data || [];
  }

  return <ProductsPage initialProducts={products} token={accessToken} />;
}
