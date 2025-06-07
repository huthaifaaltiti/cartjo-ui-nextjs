"use client";

import { memo } from "react";

import SearchBar from "@/components/shared/SearchBar";
import { useTotalUsers } from "@/contexts/TotalUsersContext";

const SearchTotalUsers = () => {
  const { searchQuery, setSearchQuery } = useTotalUsers();

  return (
    <div className="w-full">
      <SearchBar
        placeholder="Search for users"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
};

export default memo(SearchTotalUsers);
