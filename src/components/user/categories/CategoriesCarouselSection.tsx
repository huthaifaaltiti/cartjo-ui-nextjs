import { memo } from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import CategoriesEmblaCarousel from "./CategoriesEmblaCarousel";

const CategoriesCarouselSection = () => {
  return (
    <section className="w-full min-h-44 h-auto bg-white flex items-center justify-center">
      <MaxWidthWrapper className="w-full h-full">
        <CategoriesEmblaCarousel />
      </MaxWidthWrapper>
    </section>
  );
};

export default memo(CategoriesCarouselSection);
