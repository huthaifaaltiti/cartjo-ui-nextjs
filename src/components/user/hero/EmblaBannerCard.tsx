"use client";

import React, { memo } from "react";
import Image from "next/image";

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
        <div className="w-full h-full overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={altText}
            layout="fill"
            objectFit="fill"
            className="h-full w-full object-fill"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(EmblaBannerCard);
