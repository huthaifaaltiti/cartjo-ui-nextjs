"use client";

import { memo } from "react";
import { SubCategoriesContextProvider } from "@/contexts/SubCategoriesContext";
import SearchSubCategories from "./SearchSubCategories";
import SubCategoriesList from "./SubCategoriesList";
import CategoryListSelector from "./CategoryListSelector";
import CreateSubCategoryButton from "./CreateSubCategoryButton";

const SubCategoriesPage = () => {
  return (
    <SubCategoriesContextProvider>
      <CreateSubCategoryButton />
      <div className="w-full flex flex-col-reverse items-center justify-between gap-2 md:flex-row md:gap-2">
        <SearchSubCategories />
        <CategoryListSelector />
      </div>
      <div className="w-full mt-1">
        <SubCategoriesList />
      </div>
    </SubCategoriesContextProvider>
  );
};

export default memo(SubCategoriesPage);
