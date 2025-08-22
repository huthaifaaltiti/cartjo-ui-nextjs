"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/shared/SearchBar";
import { useBanners } from "@/contexts/Banners.context";

const SearchBanners = () => {
  const { searchQuery, setSearchQuery } = useBanners();
  const t = useTranslations();

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.banners.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchBanners);
