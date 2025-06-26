import { memo } from "react";
import { BlocksIcon } from "lucide-react";

import { SubCategory } from "@/types/subCategory";
import { Category } from "@/types/category";

import { SubCategoriesContextProvider } from "@/contexts/SubCategoriesContext";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import SearchSubCategories from "./SearchSubCategories";
import SubCategoriesList from "./SubCategoriesList";

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
      <ModalCreateButton
        icon={<BlocksIcon />}
        createTranslationKey="routes.dashboard.routes.subCategories.createSubCategory.label"
        ModalContent={<CreateSubCategoryForm categories={initialCategories} />}
      />
      <SearchSubCategories />

      <div className="w-full mt-3">
        <SubCategoriesList initialSubCategories={initialSubCategories} />
      </div>
    </SubCategoriesContextProvider>
  );
};

export default memo(SubCategoriesPage);
