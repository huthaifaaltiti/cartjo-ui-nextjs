import { memo } from "react";

import { CategoriesContextProvider } from "@/contexts/CategoriesContext";
import { Category } from "@/types/category";

import SearchCategories from "./SearchCategories";
import CategoriesList from "./CategoriesList";

type CategoriesPageProps = {
  initialCategories: Category[];
  accessToken: string;
};

const CategoriesPage = ({
  initialCategories,
  accessToken,
}: CategoriesPageProps) => {
  return (
    <CategoriesContextProvider accessToken={accessToken}>
      <SearchCategories />

      <div className="w-full mt-3">
        <CategoriesList initialCategories={initialCategories} />
      </div>
    </CategoriesContextProvider>
  );
};

export default memo(CategoriesPage);
