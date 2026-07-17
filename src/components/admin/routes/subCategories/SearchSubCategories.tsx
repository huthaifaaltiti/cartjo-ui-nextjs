"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { useSubCategories } from "@/contexts/SubCategoriesContext";
import SearchBar from "@/components/shared/SearchBar";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const SearchSubCategories = () => {
  const { searchQuery, setSearchQuery } = useSubCategories();
  const t = useTranslations();

  const { canReadSubCategory } = usePermission({
    canReadSubCategory: Permission.SUB_CATEGORIES_READ,
  });

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.subCategories.components.SearchBar.placeholder",
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        disabled={!canReadSubCategory}
      />
    </div>
  );
};

export default memo(SearchSubCategories);
