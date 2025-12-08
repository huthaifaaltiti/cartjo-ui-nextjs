import { Product } from "@/types/product.type";
import { Category } from "@/types/category.type";

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
      limit: PAGINATION_LIMITS.PRODUCTS,
    });

    const catsResp = await fetchCategories({
      token: accessToken,
      limit: PAGINATION_LIMITS.CATEGORIES,
    });

    categories = catsResp?.data || [];
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
