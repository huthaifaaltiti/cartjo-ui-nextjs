"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { useCategories } from "@/contexts/CategoriesContext";
import SearchBar from "@/components/shared/SearchBar";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const SearchCategories = () => {
  const { searchQuery, setSearchQuery } = useCategories();
  const t = useTranslations();

  const { canReadCategory } = usePermission({
    canReadCategory: Permission.CATEGORIES_READ,
  });

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.categories.components.SearchBar.placeholder",
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        disabled={!canReadCategory}
      />
    </div>
  );
};

export default memo(SearchCategories);
