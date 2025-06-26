import { memo } from "react";
import { Blocks } from "lucide-react";

import { CategoriesContextProvider } from "@/contexts/CategoriesContext";
import { Category } from "@/types/category";

import SearchCategories from "./SearchCategories";
import CategoriesList from "./CategoriesList";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateCategoryForm from "./CreateCategoryForm";

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
      <ModalCreateButton
        icon={<Blocks />}
        createTranslationKey="routes.dashboard.routes.categories.createCategory.label"
        ModalContent={<CreateCategoryForm />}
      />
      <SearchCategories />

      <div className="w-full mt-3">
        <CategoriesList initialCategories={initialCategories} />
      </div>
    </CategoriesContextProvider>
  );
};

export default memo(CategoriesPage);
