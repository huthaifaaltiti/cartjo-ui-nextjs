"use client";

import React, { memo, useState, useCallback, useEffect } from "react";
import Image, { ImageProps } from "next/image";

import { DEFAULT_FALLBACK_IMAGE } from "@/config/media.config";

type ImageWithFallbackProps = Omit<ImageProps, "fill"> & {
  fallbackSrc?: string;
  useFill?: boolean; // toggle between fill vs width/height
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  alt = "image",
  useFill = true, // default to fill
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = useCallback(() => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  }, [imgSrc, fallbackSrc]);

  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
    }
  }, [src, imgSrc]);

  return (
    <div className="relative w-full h-full">
      <Image
        {...rest}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        fill={useFill} // ✅ automatically uses fill
      />
    </div>
  );
};

export default memo(ImageWithFallback);
