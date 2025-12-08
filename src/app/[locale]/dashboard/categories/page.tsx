import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { fetchCategories } from "@/hooks/react-query/useCategoriesQuery";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

import CategoriesPage from "@/components/admin/routes/categories/CategoriesPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  const { data } = await fetchCategories({
    token: accessToken,
    limit: PAGINATION_LIMITS.CATEGORIES,
  });

  return <CategoriesPage initialCategories={data} accessToken={accessToken} />;
}
