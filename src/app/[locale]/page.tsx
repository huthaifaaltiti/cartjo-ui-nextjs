import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getActiveBannersQueryOptions,
  getActiveCategoriesQueryOptions,
  getActiveShowcasesQueryOptions,
  getCategoriesPicksQueryOptions,
} from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";
import { getRandomItems } from "@/utils/getRandomItems";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { SELECTED_CATEGORIES_COUNT } from "@/config/home.config";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { Category } from "@/types/category.type";
import HeroSection from "@/components/HeroSection";
import MainHeader from "@/components/MainHeader";
import CategoriesCarousel from "@/components/user/categories/CategoriesCarouselSection";
import TopBar from "@/components/TopBar";
import { HomeContextProvider } from "@/contexts/HomeContext";
import HomeShowcase from "@/components/user/home/HomeShowcase";
import SelectedCategoriesItems from "@/components/user/home/SelectedCategoriesItems";
import Footer from "@/components/Footer";
import { Locale } from "@/types/locale";
import { DataResponse } from "@/types/service-response.type";
import { Logo } from "@/types/logo";
import { getActiveLogoQueryOptions } from "@/hooks/react-query/useLogosQuery";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const token = await getAccessTokenFromServerSession();
  const queryClient = getQueryClient();

  const [categoriesResult] = await Promise.all([
    queryClient.fetchQuery(getActiveCategoriesQueryOptions(locale || "en")),
    queryClient.prefetchQuery(
      getActiveShowcasesQueryOptions(
        PAGINATION_LIMITS.ACTIVE_ITEMS_IN_HOME_SHOWCASE,
      ),
    ),
    queryClient.prefetchQuery(getActiveBannersQueryOptions(locale || "en")),
  ]);

  const categories = categoriesResult?.data ?? [];
  const activeCategories = categories.filter(
    (c: Category) => c.isActive && !c.isDeleted,
  );

  const randomCategories = getRandomItems(
    activeCategories,
    SELECTED_CATEGORIES_COUNT,
  );

  await Promise.all(
    randomCategories.map((c: Category) =>
      queryClient.prefetchQuery(
        getCategoriesPicksQueryOptions(c._id, "en", token ?? ""),
      ),
    ),
  );

  await queryClient.prefetchQuery<DataResponse<Logo>>(
    getActiveLogoQueryOptions({ lang: locale }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeContextProvider>
        <TopBar />
        <MainHeader />
        <HeroSection />
        <CategoriesCarousel />
        <HomeShowcase />
        <SelectedCategoriesItems randomCategories={randomCategories} />
      </HomeContextProvider>
      <Footer locale={locale} />
    </HydrationBoundary>
  );
}
