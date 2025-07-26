import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

import { fetchSubCategories } from "@/hooks/react-query/useSubCategoriesQuery";
import { fetchCategories } from "@/hooks/react-query/useCategoriesQuery";

import { Category } from "@/types/category";
import { SubCategory } from "@/types/subCategory";

import SubCategoriesPage from "@/components/admin/routes/subCategories/SubCategoriesPage";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();

  let categories: Category[] = [];
  let subCategories: SubCategory[] = [];

  if (accessToken) {
    const catsResp = await fetchCategories({
      token: accessToken,
      limit: PAGINATION_LIMITS.CATEGORIES,
    });

    const subCatsResp = await fetchSubCategories({
      token: accessToken,
      limit: PAGINATION_LIMITS.SUB_CATEGORIES,
    });

    categories = catsResp?.data || [];
    subCategories = subCatsResp?.data || [];
  }

  return (
    <SubCategoriesPage
      initialCategories={categories}
      initialSubCategories={subCategories}
      accessToken={accessToken}
    />
  );
}
