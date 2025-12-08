import { memo } from "react";
import { useTranslations } from "next-intl";
import { Search, RefreshCw, AlertCircle, ChevronLeft } from "lucide-react";
import MainSearchBar from "@/components/MainSearchBar";
import { Button } from "@/components/ui/button";

const NoSearchText = () => {
  const t = useTranslations();

  return (
    <div className="w-full">
      <div className="mb-12">
        <MainSearchBar />
      </div>

      {/* No Results Content */}
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t("routes.search.components.NoSearch.noSearchTextTitle")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {t("routes.search.components.NoSearch.noSearchTextDesc")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
          <Button
            onClick={() => window.location.reload()}
            className="h-12 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white-50 font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            {t("routes.search.components.NoSearch.tryAgain")}
          </Button>

          <Button
            onClick={() => history.back()}
            className="h-12 flex items-center gap-2 px-6 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            {t("general.actions.returnBack")}
          </Button>
        </div>

        {/* Search Tips */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            {t("routes.search.components.NoSearch.searchTipsTitle", {
              fallback: "Search Tips",
            })}
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              {t("routes.search.components.NoSearch.tip1", {
                fallback: "Check your spelling and try again",
              })}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              {t("routes.search.components.NoSearch.tip2", {
                fallback: "Use different keywords or shorter terms",
              })}
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              {t("routes.search.components.NoSearch.tip3", {
                fallback: "Try more general search terms",
              })}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(NoSearchText);
