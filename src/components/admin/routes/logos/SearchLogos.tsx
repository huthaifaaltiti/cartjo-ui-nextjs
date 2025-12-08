"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import SearchBar from "@/components/shared/SearchBar";
import { useLogos } from "@/contexts/LogosContext";

const SearchLogos = () => {
  const { searchQuery, setSearchQuery } = useLogos();
  const t = useTranslations();

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.logos.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchLogos);
