import { memo } from "react";
import { Blocks } from "lucide-react";
import { Category } from "@/types/category.type";
import { CategoriesContextProvider } from "@/contexts/CategoriesContext";
import SearchCategories from "./SearchCategories";
import CategoriesList from "./CategoriesList";
import ModalCreateButton from "@/components/shared/ModalCreateButton";
import CreateCategoryForm from "./CreateCategoryForm";

type CategoriesPageProps = {
  initialCategories: Category[];
  accessToken: string | null;
};

const CategoriesPage = ({
  initialCategories,
  accessToken,
}: CategoriesPageProps) => {
  return (
    <CategoriesContextProvider accessToken={accessToken}>
      <div className="w-full flex flex-col items-start gap-1 md:flex-row md:items-center md:justify-between md:gap-5 mb-3">
        <SearchCategories />
        <ModalCreateButton
          icon={<Blocks />}
          createTranslationKey="routes.dashboard.routes.categories.createCategory.label"
          ModalContent={<CreateCategoryForm />}
        />
      </div>

      <CategoriesList initialCategories={initialCategories} />
    </CategoriesContextProvider>
  );
};

export default memo(CategoriesPage);
