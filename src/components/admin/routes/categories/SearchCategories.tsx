"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import { useCategories } from "@/contexts/CategoriesContext";
import SearchBar from "@/components/shared/SearchBar";

const SearchCategories = () => {
  const { searchQuery, setSearchQuery } = useCategories();
  const t = useTranslations();

  return (
    <div className="w-full">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.categories.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchCategories);
