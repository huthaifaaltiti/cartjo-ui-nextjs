"use client";

import { useState } from "react";
import Image from "next/image";

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  [key: string]: any; // For additional props
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 75,
  loading = "lazy",
  priority = false,
  placeholder = "empty",
  blurDataURL,
  onError,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTDEwMCAxMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setImageError(true);
    if (onError) {
      onError(e);
    } else {
      (e.target as HTMLImageElement).src = fallbackImage;
    }
  };

  return (
    <Image
      src={imageError ? fallbackImage : src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      quality={quality}
      loading={loading}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={handleImageError}
      {...props}
    />
  );
};

export default CustomImage;
