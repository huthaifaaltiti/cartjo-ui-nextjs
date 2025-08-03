import HeroSection from "@/components/HeroSection";
import MainHeader from "@/components/MainHeader";
import CategoriesCarousel from "@/components/user/categories/CategoriesCarouselSection";
import TopBar from "@/components/TopBar";
import { HomeContextProvider } from "@/contexts/HomeContext";
import HomeShowcase from "@/components/user/home/HomeShowcase";

export default function Home() {
  return (
    <HomeContextProvider>
      <TopBar />
      <MainHeader />
      <HeroSection />
      <CategoriesCarousel />
      <HomeShowcase />
    </HomeContextProvider>
  );
}
