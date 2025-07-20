import { Product } from "@/types/product.type";
import { Category } from "@/types/category";

import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

import { fetchProducts } from "@/hooks/react-query/useProductsQuery";
import { fetchCategories } from "@/hooks/react-query/useCategoriesQuery";

import ProductsPage from "@/components/admin/routes/products/ProductsPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  let products: Product[] = [];
  let categories: Category[] = [];

  if (accessToken) {
    const prodsResp = await fetchProducts({
      token: accessToken,
      limit: PAGINATION_LIMITS.TOTAL_PRODUCTS_LIMIT,
    });

    const catsResp = await fetchCategories({
      token: accessToken,
      limit: PAGINATION_LIMITS.TOTAL_CATEGORIES_LIMIT,
    });

    categories = catsResp?.categories || [];
    products = prodsResp?.data || [];
  }

  return (
    <ProductsPage
      initialProducts={products}
      initialCategories={categories}
      token={accessToken}
    />
  );
}
