"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/shared/SearchBar";
import { useTypeHintConfig } from "@/contexts/TypeHintConfig.context";

const SearchTypeHintConfigs = () => {
  const t = useTranslations();
  const { searchQuery, setSearchQuery } = useTypeHintConfig();

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.typeHintConfigs.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchTypeHintConfigs);
