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
              width={1300} // Match your largest slide width
              height={400} // Match your largest slide height
              useFill={false}
              quality={95}
              priority={true} // For above-fold content
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
        )}

        {!banner?.withAction && (
          <ImageWithFallback
            src={imageUrl}
            alt={altText}
            width={1300}
            height={400}
            useFill={false}
            className="h-full w-full object-cover"
            quality={95}
            priority={true}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default memo(EmblaBannerCard);
