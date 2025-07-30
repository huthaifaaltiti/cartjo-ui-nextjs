import { memo } from "react";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";

const HeroSection = () => {
  return (
    <div className="w-full bg-white-50 py-3">
      <MaxWidthWrapper>
        <div>Hero Section</div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(HeroSection);
