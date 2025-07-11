export const getTagsInputClassNames = (disabled: boolean = false) => ({
  tags: "flex flex-wrap gap-2 min-h-[1rem]",
  tag: "inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-xs font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-100 hover:to-indigo-100 mx-1",
  remove:
    "ml-1 cursor-pointer text-blue-500 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-all duration-200",
  tagInput: "relative",
  tagInputField: `w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:border-gray-300 ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`,
  suggestions:
    "absolute top-full left-0 right-0 mt-1 border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto bg-white z-50 backdrop-blur-sm",
  activeSuggestion:
    "bg-blue-50 text-blue-700 border-l-4 border-blue-400 px-3 py-2",
  editTagInputField:
    "border-2 border-blue-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-white",
  clearAll: "hidden", // We'll use our custom clear all button
});

export const tagStyledClassName =
  "inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm";

export const clearAllButtonClassName =
  "inline-flex items-center gap-1.5 text-xs text-gray-500 mt-3 cursor-pointer hover:text-red-500 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed";

export const tagCounterClassName = "flex items-center justify-between mt-2";

export const tagCounterTextClassName = "text-xs text-gray-500";

export const maxTagsWarningClassName =
  "text-xs text-amber-600 flex items-center gap-1";
