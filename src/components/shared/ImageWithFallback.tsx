"use client";

import React, { memo, useState, useCallback, useEffect } from "react";
import Image, { ImageProps } from "next/image";

import { DEFAULT_FALLBACK_IMAGE } from "@/config/media.config";

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc?: string;
};

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  alt = "image",
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

  return <Image {...rest} src={imgSrc} alt={alt} onError={handleError} />;
};

export default memo(ImageWithFallback);
