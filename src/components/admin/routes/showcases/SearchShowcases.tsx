"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import SearchBar from "@/components/shared/SearchBar";
import { useShowcases } from "@/contexts/Showcase.context";

const SearchShowcases = () => {
  const t = useTranslations();
  const { searchQuery, setSearchQuery } = useShowcases();

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.showcases.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchShowcases);
