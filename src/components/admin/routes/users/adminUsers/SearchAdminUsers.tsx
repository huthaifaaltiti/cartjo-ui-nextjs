"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { useAdminUsers } from "@/contexts/AdminUsersContext";
import SearchBar from "@/components/shared/SearchBar";

const SearchAdminUsers = () => {
  const { searchQuery, setSearchQuery } = useAdminUsers();
  const t = useTranslations();

  return (
    <div className="w-full">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.users.routes.adminUsers.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchAdminUsers);
