"use client";

import React, { memo } from "react";
import { Banner } from "@/types/banner.type";

type EmblaBannerCardProps = {
  banner: Banner;
  isArabic: boolean;
};

const EmblaBannerCard = ({ banner, isArabic }: EmblaBannerCardProps) => {
  const imageUrl = isArabic ? banner?.media?.ar?.url : banner?.media?.en?.url;

  const altText = banner?.title?.[isArabic ? "ar" : "en"] || "Banner";

  return (
    <div className="embla__slide">
      <div className="w-full h-full">
        <div className="w-full h-full overflow-hidden">
          <img
            src={imageUrl}
            alt={altText}
            className="h-full w-full object-fill"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(EmblaBannerCard);
