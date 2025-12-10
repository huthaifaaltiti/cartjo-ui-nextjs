"use client";

import { memo } from "react";
import { BlocksIcon } from "lucide-react";
import { SubCategory } from "@/types/subCategory";
import { Category } from "@/types/category.type";
import { SubCategoriesContextProvider } from "@/contexts/SubCategoriesContext";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import SearchSubCategories from "./SearchSubCategories";
import SubCategoriesList from "./SubCategoriesList";
import CategoryListSelector from "./CategoryListSelector";

type SubCategoriesPageProps = {
  initialCategories: Category[];
  initialSubCategories: SubCategory[];
  accessToken: string | null;
};

const SubCategoriesPage = ({
  accessToken,
  initialSubCategories,
  initialCategories,
}: SubCategoriesPageProps) => {
  return (
    <SubCategoriesContextProvider accessToken={accessToken}>
      <ModalCreateButton
        icon={<BlocksIcon />}
        createTranslationKey="routes.dashboard.routes.subCategories.createSubCategory.label"
        ModalContent={<CreateSubCategoryForm categories={initialCategories} />}
      />

      <div className="w-full flex flex-col-reverse items-center justify-between gap-2 md:flex-row md:gap-2">
        <SearchSubCategories />
        <CategoryListSelector categoriesList={initialCategories} />
      </div>

      <div className="w-full mt-1">
        <SubCategoriesList initialSubCategories={initialSubCategories} />
      </div>
    </SubCategoriesContextProvider>
  );
};

export default memo(SubCategoriesPage);
