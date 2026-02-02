import { memo } from "react";

type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholder: string;
  searchQuery: string;
  className?: string;
  setSearchQuery: (searchQuery: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const SearchBar = ({
  placeholder = "Search something..",
  searchQuery,
  setSearchQuery,
  onKeyDown,
  className,
  ...props
}: SearchBarProps) => {
  const defaultClassName =
    "w-full px-4 py-2 text-sm border border-gray-300 bg-white-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed";

  return (
    <div className="w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className={className ? className : defaultClassName}
        onKeyDown={onKeyDown}
        {...props}
      />
    </div>
  );
};

export default memo(SearchBar);
