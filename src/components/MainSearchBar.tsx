"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import SearchBar from "@/components/shared/SearchBar";
import { useHome } from "@/contexts/HomeContext";

const MainSearchBar = () => {
  const { mainSearchQuery, setMainSearchQuery } = useHome();
  const t = useTranslations();

  return (
    <SearchBar
      className="w-full h-12 px-4 py-2 bg-[#F3F4F6] text-[#6B7280] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      placeholder={t("routes.home.components.MainSearchBar.placeholder")}
      searchQuery={mainSearchQuery}
      setSearchQuery={setMainSearchQuery}
    />
  );
};

export default memo(MainSearchBar);
