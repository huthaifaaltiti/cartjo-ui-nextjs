import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import CategoriesEmblaCarousel from "./CategoriesEmblaCarousel";

const CategoriesCarouselSection = () => {
  return (
    <section className="w-full h-60 bg-white py-11">
      <MaxWidthWrapper className="h-full">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <CategoriesEmblaCarousel />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default memo(CategoriesCarouselSection);
