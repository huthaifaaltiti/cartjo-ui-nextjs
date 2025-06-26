"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import { useSubCategories } from "@/contexts/SubCategoriesContext";
import SearchBar from "@/components/shared/SearchBar";

const SearchSubCategories = () => {
  const { searchQuery, setSearchQuery } = useSubCategories();
  const t = useTranslations();

  return (
    <div className="w-full">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.subCategories.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchSubCategories);
