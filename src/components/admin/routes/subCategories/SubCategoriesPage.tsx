"use client";

import { memo } from "react";
import { BlocksIcon } from "lucide-react";

import { SubCategory } from "@/types/subCategory";
import { Category } from "@/types/category";

import { SubCategoriesContextProvider } from "@/contexts/SubCategoriesContext";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import SearchSubCategories from "./SearchSubCategories";
import SubCategoriesList from "./SubCategoriesList";
import CategoryListSelector from "./CategoryListSelector";

type SubCategoriesPageProps = {
  initialCategories: Category[];
  initialSubCategories: SubCategory[];
  accessToken: string;
};

const SubCategoriesPage = ({
  accessToken,
  initialSubCategories,
  initialCategories,
}: SubCategoriesPageProps) => {
  return (
    <SubCategoriesContextProvider accessToken={accessToken}>
      <div className="w-full flex items-center justify-between gap-2">
        <CategoryListSelector categoriesList={initialCategories} />

        <ModalCreateButton
          icon={<BlocksIcon />}
          createTranslationKey="routes.dashboard.routes.subCategories.createSubCategory.label"
          ModalContent={
            <CreateSubCategoryForm categories={initialCategories} />
          }
        />
      </div>

      <SearchSubCategories />

      <div className="w-full mt-3">
        <SubCategoriesList initialSubCategories={initialSubCategories} />
      </div>
    </SubCategoriesContextProvider>
  );
};

export default memo(SubCategoriesPage);
