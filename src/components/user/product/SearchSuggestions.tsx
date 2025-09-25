import { Search } from "lucide-react";
import { memo } from "react";

const SearchSuggestions = () => {
  const suggestions = [
    "notebooks", "pens", "office supplies", "desk organizers", 
    "stationery sets", "planners", "markers", "folders"
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
        <Search className="w-4 h-4 mr-2" />
        Popular Searches
      </h4>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(SearchSuggestions)