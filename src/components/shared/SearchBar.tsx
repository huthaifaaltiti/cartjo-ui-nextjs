import { memo } from "react";

type SearchBarProps = {
  placeholder: string;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
};

const SearchBar = ({
  placeholder = "Search something..",
  searchQuery,
  setSearchQuery,
}: SearchBarProps) => {
  return (
    <div className="w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 text-sm border border-gray-300 bg-white-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );
};

export default memo(SearchBar);
