import { memo } from "react";
import HeroBanner from "./user/hero/HeroBanner";

const HeroSection = () => {
  return (
    <div className="w-full h-auto">
      <HeroBanner />
    </div>
  );
};

export default memo(HeroSection);
