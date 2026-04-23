import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import CategoriesEmblaCarousel from "./CategoriesEmblaCarousel";

const CategoriesCarouselSection = () => {
  return (
    <section className="w-full bg-white flex items-center justify-center">
      <MaxWidthWrapper className="w-full mt-6 mb-8 sm:mt-8 sm:mb-10 md:mt-10 md:mb-12 lg:mt-12 lg:mb-16">
        <CategoriesEmblaCarousel />
      </MaxWidthWrapper>
    </section>
  );
};

export default CategoriesCarouselSection;
