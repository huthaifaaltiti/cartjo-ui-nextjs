"use client";

import {
  AlertCircle,
  ArrowLeft,
  Package,
  RefreshCw,
  Search,
} from "lucide-react";
import { memo, useState } from "react";
import SearchSuggestions from "./search-suggestions/SearchSuggestions";
import { useTranslations } from "next-intl";
import RecommendedProducts from "./recommended-products/RecommendedProducts";
import HelpSection from "@/components/shared/HelpSection";
import { useRouter } from "next/navigation";

const NoProductFound = ({
  productId,
  onGoBack,
  onRetry,
  onSearchSimilar,
  showSuggestions = true,
}: {
  productId: string;
  onGoBack: () => void;
  onRetry: () => void;
  onSearchSimilar: (searchQuery: string) => void;
  showSuggestions: boolean;
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSimilar?.(searchQuery);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Main Error Section */}
      <div className="text-center space-y-6 mb-12">
        {/* Animated Icon */}
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="relative z-10 w-full h-full bg-gradient-to-br from-primary-500 to-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            {t("routes.product.components.NoProductFound.title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("routes.product.components.NoProductFound.desc")}
          </p>
          {productId && (
            <p className="text-sm text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded-lg inline-block">
              {t("routes.product.components.NoProductFound.prodId")}:{" "}
              {productId}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <button
            onClick={onGoBack}
            className="flex items-center space-x-2 bg-gray-900 text-white-50 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t("general.actions.goBack")}</span>
          </button>

          <button
            onClick={onRetry}
            className="flex items-center space-x-2 bg-blue-600 text-white-50 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            <span>{t("general.actions.tryAgain")}</span>
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          {t("routes.product.components.NoProductFound.searchFor")}
        </h3>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              //   onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white-50 px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t("general.actions.search")}
            </button>
          </div>
        </div>
      </div>

      {showSuggestions && (
        <div className="space-y-8">
          <SearchSuggestions />
          <RecommendedProducts />
          <HelpSection
            primaryAction={{
              label: t("components.HelpSection.labels.contactSupport"),
              onClick: () => router.push("/support"),
            }}
            secondaryAction={{
              label: t("components.HelpSection.labels.browseCategories"),
              onClick: () => router.push("/"),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(NoProductFound);
