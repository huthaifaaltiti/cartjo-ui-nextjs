"use client";

import { memo } from "react";
import SearchBar from "@/components/shared/SearchBar";
import { useTotalUsers } from "@/contexts/TotalUsersContext";
import { useTranslations } from "next-intl";

const SearchTotalUsers = () => {
  const { searchQuery, setSearchQuery } = useTotalUsers();
  const t = useTranslations();

  return (
    <div className="w-full">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.users.routes.totalUsers.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchTotalUsers);
