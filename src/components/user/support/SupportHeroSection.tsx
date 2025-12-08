import { memo } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import SearchBar from "@/components/shared/SearchBar";

interface SupportHeroSectionProps {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

const SupportHeroSection = ({
  searchQuery,
  setSearchQuery,
}: SupportHeroSectionProps) => {
  const t = useTranslations();

  return (
    <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MaxWidthWrapper>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {t("routes.support.components.heroSection.title")}
            </h1>
            <p className="text-xl text-white-50/90 mb-8">
              {t("routes.support.components.heroSection.subTitle")}
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

              <SearchBar
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t("routes.support.components.heroSection.searchPlaceholder")}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default memo(SupportHeroSection);
