import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { getRandomItems } from "@/utils/getRandomItems";
import { SELECTED_CATEGORIES_COUNT } from "@/config/home.config";
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
import ReduxInitializer from "@/components/ReduxInitializer";
import {
  prefetchCategoryPicks,
  prefetchHomeData,
} from "@/services/prefetch/home";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";
import { LogoType } from "@/enums/logoType.enum";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const queryClient = getQueryClient();

  const categories = await prefetchHomeData(queryClient, locale);
  const activeCategories = categories.filter(
    (c: Category) => c.isActive && !c.isDeleted,
  );
  const randomCategories = getRandomItems(
    activeCategories,
    SELECTED_CATEGORIES_COUNT,
  );

  if (randomCategories.length > 0) {
    await prefetchCategoryPicks({ randomCategories, queryClient, locale });
  }

  await prefetchActiveLogo({ queryClient, locale, type: LogoType.MAIN });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeContextProvider>
        <ReduxInitializer>
          <TopBar />
          <MainHeader />
          <HeroSection />
          <CategoriesCarousel />
          <HomeShowcase />
          <SelectedCategoriesItems randomCategories={randomCategories} />
        </ReduxInitializer>
      </HomeContextProvider>
      <Footer locale={locale} />
    </HydrationBoundary>
  );
}
