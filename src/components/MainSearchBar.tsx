"use client";

import { memo, useState, KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { X } from "lucide-react";
import SearchBar from "@/components/shared/SearchBar";
import { useHome } from "@/contexts/HomeContext";
import { useGeneralContext } from "@/contexts/General.context";

const MainSearchBar = () => {
  const t = useTranslations();
  const router = useRouter();
  const { locale } = useGeneralContext();
  const { mainSearchQuery, setMainSearchQuery } = useHome();
  const { isArabic } = useGeneralContext();

  const [q, setQ] = useQueryState<string>("q", {
    defaultValue: "",
    parse: (value) => String(value),
    serialize: (value) => String(value),
  });
  const [typeHint] = useQueryState("typeHint");

  const [inputValue, setInputValue] = useState<string>(q || mainSearchQuery);

  const executeSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setMainSearchQuery(trimmedQuery);

    if (trimmedQuery) {
      const params = new URLSearchParams();
      params.set("q", trimmedQuery);
      if (typeHint) params.set("typeHint", typeHint);

      router.push(`/${locale}/search?${params.toString()}`);
    } else {
      setQ("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    setMainSearchQuery("");

    const params = new URLSearchParams();
    if (typeHint) {
      params.set("typeHint", typeHint);
      router.push(`/${locale}/search?${params.toString()}`);
    } else {
      setQ("");
    }
  };

  return (
    <div className="w-full relative">
      <SearchBar
        className="w-full h-12 px-4 pr-10 pl-4 bg-[#F3F4F6] text-[#374151] text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        placeholder={t("routes.home.components.MainSearchBar.placeholder")}
        searchQuery={inputValue}
        setSearchQuery={setInputValue}
        onKeyDown={handleKeyDown}
      />

      {inputValue && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={handleClear}
          className={`absolute ${
            isArabic ? "left-3" : "right-3"
          } top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
        >
          <X size={18} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default memo(MainSearchBar);
