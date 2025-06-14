"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import { useDeletedUsers } from "@/contexts/DeletedUsersContext";

import SearchBar from "@/components/shared/SearchBar";

const SearchDeletedUsers = () => {
  const { searchQuery, setSearchQuery } = useDeletedUsers();
  const t = useTranslations();

  return (
    <div className="w-full">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.users.routes.deletedUsers.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchDeletedUsers);
