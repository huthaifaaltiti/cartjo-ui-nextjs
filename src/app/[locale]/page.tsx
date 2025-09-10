import HeroSection from "@/components/HeroSection";
import MainHeader from "@/components/MainHeader";
import CategoriesCarousel from "@/components/user/categories/CategoriesCarouselSection";
import TopBar from "@/components/TopBar";
import { HomeContextProvider } from "@/contexts/HomeContext";
import HomeShowcase from "@/components/user/home/HomeShowcase";
import { getQueryClient } from "@/utils/queryUtils";
import {
  getActiveBannersQueryOptions,
  getActiveCategoriesQueryOptions,
  getActiveShowcasesQueryOptions,
} from "@/utils/queryOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = getQueryClient();

  /**
   * Home Page
   * - Prefetches showcases, categories, and banners on the server
   * - Hydrates React Query cache for instant client render
   */
  await Promise.all([
    queryClient.prefetchQuery(
      getActiveShowcasesQueryOptions(
        PAGINATION_LIMITS.ACTIVE_ITEMS_IN_HOME_SHOWCASE
      )
    ),
    queryClient.prefetchQuery(getActiveCategoriesQueryOptions("en")),
    queryClient.prefetchQuery(getActiveBannersQueryOptions("en")),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HomeContextProvider>
      <TopBar />
      <MainHeader />

      <HydrationBoundary state={dehydratedState}>
        <HeroSection />
        <CategoriesCarousel />
        <HomeShowcase />
      </HydrationBoundary>
    </HomeContextProvider>
  );
}
