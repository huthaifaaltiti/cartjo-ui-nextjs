import { memo } from "react";

import CategoriesCarouselClient from "./CategoriesCarouselClient";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";

const CategoriesCarouselSection = () => {
  return (
    <section className="w-full h-60 bg-white py-11">
      <MaxWidthWrapper className="h-full">
        <div className="h-full flex flex-col">
          <div className="flex-1 min-h-0">
            <CategoriesCarouselClient />
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default memo(CategoriesCarouselSection);
