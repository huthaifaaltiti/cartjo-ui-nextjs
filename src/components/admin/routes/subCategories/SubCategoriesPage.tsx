"use client";

import { memo } from "react";
import { BlocksIcon } from "lucide-react";
import { SubCategoriesContextProvider } from "@/contexts/SubCategoriesContext";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import SearchSubCategories from "./SearchSubCategories";
import SubCategoriesList from "./SubCategoriesList";
import CategoryListSelector from "./CategoryListSelector";

const SubCategoriesPage = () => {
  return (
    <SubCategoriesContextProvider>
      <ModalCreateButton
        icon={<BlocksIcon />}
        createTranslationKey="routes.dashboard.routes.subCategories.createSubCategory.label"
        ModalContent={<CreateSubCategoryForm />}
      />
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
