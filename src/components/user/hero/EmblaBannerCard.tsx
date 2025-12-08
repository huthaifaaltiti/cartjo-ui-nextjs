"use client";

import React, { memo } from "react";
import { Banner } from "@/types/banner.type";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Link from "next/link";

type EmblaBannerCardProps = {
  banner: Banner;
  isArabic: boolean;
};

const EmblaBannerCard = ({ banner, isArabic }: EmblaBannerCardProps) => {
  const imageUrl = isArabic ? banner?.media?.ar?.url : banner?.media?.en?.url;

  const altText = banner?.title?.[isArabic ? "ar" : "en"] || "Banner";

  return (
    <div className="w-full h-full">
      <div className="w-full h-full overflow-hidden relative">
        {banner?.withAction && banner?.link && (
          <Link href={banner?.link} target="_blank">
            <ImageWithFallback
              src={imageUrl}
              alt={altText}
              useFill={true}
              className="h-full w-full object-cover"
            />
          </Link>
        )}

        {!banner?.withAction && (
          <ImageWithFallback
            src={imageUrl}
            alt={altText}
            useFill={true}
            className="h-full w-full object-fill"
          />
        )}
      </div>
    </div>
  );
};

export default memo(EmblaBannerCard);
