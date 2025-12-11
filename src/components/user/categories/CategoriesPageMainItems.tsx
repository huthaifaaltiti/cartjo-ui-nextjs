"use client";

import { memo, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useActiveCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { isArabicLocale } from "@/config/locales.config";
import { Category } from "@/types/category.type";
// TODO: Add these imports based on your routing setup
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

const CategoriesPageMainItems = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { data, isLoading, isFetching, error, isError } =
    useActiveCategoriesQuery();

  const categories: Category[] = useMemo(() => {
    let filteredCategories = data?.data ?? [];

    // TODO: Implement search functionality
    if (searchQuery) {
      filteredCategories = filteredCategories.filter((category) =>
        isArabic
          ? category.name.ar.toLowerCase().includes(searchQuery.toLowerCase())
          : category.name.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // TODO: Add more filter options based on your business needs
    // Examples: featured categories, recently updated, by subcategory count, etc.
    switch (selectedFilter) {
      case "featured":
        // TODO: Add featured flag to Category interface and filter here
        // filteredCategories = filteredCategories.filter(cat => cat.isFeatured);
        break;
      case "new":
        // TODO: Filter by recently created categories
        // filteredCategories = filteredCategories.filter(cat =>
        //   new Date(cat.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        // );
        break;
      default:
        break;
    }

    return filteredCategories;
  }, [data, searchQuery, selectedFilter, isArabic]);

  const showLoader =
    (!isLoading && !isFetching && !isError && !data) || isLoading || isFetching;
  const showNoData =
    !isLoading && !isFetching && categories.length === 0 && !isError;
  const showError = isError;
  const showData = !isLoading && !isFetching && categories.length > 0;

  // TODO: Add analytics tracking
  const handleCategoryClick = () => {
    // TODO: Track category clicks for analytics
    // trackEvent('category_clicked', { category_id: category._id, category_name: category.name[locale] });
    // TODO: Navigate to category page
    // router.push(`/categories/${category.slug}`);
  };

  // TODO: Add loading skeleton component
  if (showLoader) {
    return (
      <div className="w-full">
        {/* TODO: Replace with proper loading skeleton */}
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-gray-200 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        {/* TODO: Add empty state illustration/icon */}
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {t("categories.no_categories_found")}
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          {t("categories.no_categories_description")}
        </p>
        {/* TODO: Add button to refresh or contact support */}
      </div>
    );
  }

  if (showError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        {/* TODO: Add error illustration/icon */}
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          {t("common.error_occurred")}
        </h3>
        <p className="text-gray-600 mb-4">{error?.message}</p>
        {/* TODO: Add retry button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          {t("common.try_again")}
        </button>
      </div>
    );
  }

  if (showData) {
    return (
      <div className="w-full space-y-6">
        {/* TODO: Add breadcrumbs */}
        <nav className="text-sm text-gray-600">
          {/* TODO: Implement breadcrumb navigation */}
          {/* Home > Categories */}
        </nav>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("categories.page_title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("categories.page_description", { count: categories.length })}
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 lg:min-w-96">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t("categories.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* TODO: Add search icon */}
              <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
            </div>

            {/* Filter Dropdown */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t("categories.filter.all")}</option>
              <option value="featured">
                {t("categories.filter.featured")}
              </option>
              <option value="new">{t("categories.filter.new")}</option>
              {/* TODO: Add more filter options */}
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories?.map((category: Category) => (
            <div
              key={`category_${category?._id}`}
              // onClick={() => handleCategoryClick(category)}
              onClick={() =>{}}
              className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Category Image */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {/* TODO: Display category image from media field */}
                {/* {category.media?.[locale]?.url ? (
                  // TODO: Replace with Next.js Image component for optimization
                  <img
                    src={category.media[locale].url}
                    alt={isArabic ? category.name.ar : category.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  // TODO: Add default category icon/placeholder
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                    📦
                  </div>
                )} */}

                {/* TODO: Add category badges (new, featured, sale, etc.) */}
                {/* Example: New Category Badge */}
                {/* {isNewCategory(category.createdAt) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {t('categories.badges.new')}
                  </div>
                )} */}

                {/* TODO: Add subcategory count badge */}
                {category.subCategories.length > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {category.subCategories.length}{" "}
                    {t("categories.subcategories")}
                  </div>
                )}
              </div>

              {/* Category Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {isArabic ? category.name.ar : category.name.en}
                </h3>

                {/* TODO: Add category description if available */}
                {/* {category.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {isArabic ? category.description.ar : category.description.en}
                  </p>
                )} */}

                {/* TODO: Add product count per category */}
                {/* <p className="text-sm text-gray-500 mt-2">
                  {category.productCount || 0} {t('categories.products')}
                </p> */}

                {/* Subcategories Preview */}
                {category.subCategories.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("categories.popular_subcategories")}:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {category.subCategories
                        .slice(0, 3)
                        .map((subCat, index) => (
                          <span
                            key={subCat._id || index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {/* {isArabic ? subCat.name.ar : subCat.name.en} */}
                          </span>
                        ))}
                      {category.subCategories.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{category.subCategories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* TODO: Add quick action buttons */}
                <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs text-blue-600 hover:underline">
                    {t("categories.view_products")}
                  </button>
                  {/* TODO: Add wishlist/favorite functionality */}
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    ♡
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TODO: Add pagination if you have many categories */}
        {/* <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        /> */}

        {/* TODO: Add "Load More" button for infinite scroll */}
        {/* <div className="text-center mt-8">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            {t('common.load_more')}
          </button>
        </div> */}

        {/* TODO: Add recently viewed categories */}
        {/* <RecentlyViewedCategories /> */}

        {/* TODO: Add newsletter signup or promotional banner */}
        {/* <NewsletterSignup /> */}
      </div>
    );
  }

  return null;
};

export default memo(CategoriesPageMainItems);

/* 
TODO: Additional Features to Consider Adding:

1. SEO Enhancements:
   - Add meta tags for category page
   - Implement structured data (JSON-LD) for categories
   - Add canonical URLs

2. Performance Optimizations:
   - Implement virtual scrolling for large category lists
   - Add image lazy loading and optimization
   - Use React.memo for category items
   - Add intersection observer for analytics

3. User Experience:
   - Add category comparison feature
   - Implement category favorites/wishlist
   - Add category sorting options (A-Z, popularity, newest)
   - Quick view modal for category details
   - Keyboard navigation support

4. Analytics & Tracking:
   - Track category views, clicks, and time spent
   - A/B test different category layouts
   - Track search queries and popular categories

5. Accessibility:
   - Add ARIA labels and roles
   - Ensure keyboard navigation
   - Add screen reader support
   - Test with accessibility tools

6. Additional Data to Display:
   - Category popularity/trending indicator
   - Average product price range in category
   - Category ratings/reviews
   - Seasonal/promotional categories
   - Category creation/update dates

7. Advanced Features:
   - Category recommendations based on user behavior
   - Voice search for categories
   - Augmented reality category preview
   - Social sharing for categories
   - Category-specific filters and sorting

8. Mobile Optimizations:
   - Swipe gestures for category navigation
   - Mobile-specific layout adjustments
   - Touch-friendly interaction areas
   - Optimize for different screen sizes

9. Internationalization:
   - RTL support for Arabic layout
   - Currency localization
   - Date format localization
   - Number format localization

10. Error Handling:
    - Network error recovery
    - Image loading fallbacks
    - Graceful degradation for missing data
    - User-friendly error messages
*/
