"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/shared/SearchBar";
import { useTypeHintConfig } from "@/contexts/TypeHintConfig.context";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const SearchTypeHintConfigs = () => {
  const t = useTranslations();
  const { searchQuery, setSearchQuery } = useTypeHintConfig();

  const { canReadTypeHintConfig } = usePermission({
    canReadTypeHintConfig: Permission.TYPE_HINT_CONFIGS_READ,
  });

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.typeHintConfigs.components.SearchBar.placeholder",
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        disabled={!canReadTypeHintConfig}
      />
    </div>
  );
};

export default memo(SearchTypeHintConfigs);
