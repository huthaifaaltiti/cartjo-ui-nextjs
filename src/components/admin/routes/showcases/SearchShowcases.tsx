"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/shared/SearchBar";
import { useShowcases } from "@/contexts/Showcase.context";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const SearchShowcases = () => {
  const t = useTranslations();
  const { searchQuery, setSearchQuery } = useShowcases();

  const { canReadShowcase } = usePermission({
    canReadShowcase: Permission.SHOWCASES_READ,
  });

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.showcases.components.SearchBar.placeholder",
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        disabled={!canReadShowcase}
      />
    </div>
  );
};

export default memo(SearchShowcases);
