"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import { useActiveUsers } from "@/contexts/ActiveUsersContext";

import SearchBar from "@/components/shared/SearchBar";

const SearchActiveUsers = () => {
  const { searchQuery, setSearchQuery } = useActiveUsers();
  const t = useTranslations();

  return (
    <div className="w-full">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.users.routes.activeUsers.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchActiveUsers);
