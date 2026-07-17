import { memo } from "react";
import { CategoriesContextProvider } from "@/contexts/CategoriesContext";
import SearchCategories from "./SearchCategories";
import CategoriesList from "./CategoriesList";
import CreateCategoryButton from "./CreateCategoryButton";

const CategoriesPage = () => {
  return (
    <CategoriesContextProvider>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchCategories />
        <CreateCategoryButton />
      </div>
      <CategoriesList />
    </CategoriesContextProvider>
  );
};

export default memo(CategoriesPage);
