import { memo } from "react";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import ShowcaseSection from "./ShowcaseSection";

const HomeShowcase = () => {
  return (
    <div className="w-full min-h-screen h-full bg-gradient-to-b from-gray-100 to-white-50">
      <MaxWidthWrapper className="w-full py-14">
        <ShowcaseSection
          header={"Editor’s Pick"}
          desc={"New products with updated stocks."}
          uri="/dashboard"
        >
          <div>h</div>
        </ShowcaseSection>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(HomeShowcase);
