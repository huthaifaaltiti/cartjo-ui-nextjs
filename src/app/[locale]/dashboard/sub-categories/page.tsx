import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { fetchSubCategories } from "@/hooks/react-query/useSubCategoriesQuery";
import { fetchCategories } from "@/hooks/react-query/useCategoriesQuery";
import { Category } from "@/types/category.type";
import { SubCategory } from "@/types/subCategory";
import SubCategoriesPage from "@/components/admin/routes/subCategories/SubCategoriesPage";
import { requireAuth } from "@/utils/authRedirect";

export default async function Page() {
  const accessToken = await getAccessTokenFromServerSession();
  requireAuth(accessToken);

  console.log({accessToken})

  let categories: Category[] = [];
  let subCategories: SubCategory[] = [];

  if (accessToken) {
    console.log('ppppppppppp subcates')
    const catsResp = await fetchCategories({
      token: accessToken,
      limit: 100,
    });

    console.log({catsResp})

    const subCatsResp = await fetchSubCategories({
      token: accessToken,
      limit: 200,
    });

    console.log({subCatsResp})

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
