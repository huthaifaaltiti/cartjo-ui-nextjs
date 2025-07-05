"use client";

import { useState, useEffect } from "react";
import CustomImage from "./CustomImage";

type ImageGalleryProps = {
  images: string[];
  alt: string;
  bulletActiveColor?: string;
  bulletInactiveColor?: string;
  badgeText?: string;
  badgeColorClass?: string;
  heightClass?: string;
  interval?: number;
  useAutoSlide?: boolean;
};

const ImageGallery = ({
  images,
  alt,
  bulletActiveColor = "bg-white",
  bulletInactiveColor = "bg-black/50",
  badgeText,
  badgeColorClass = "bg-blue-100 text-blue-800",
  heightClass = "h-20",
  interval = 3000,
  useAutoSlide = false,
}: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    if (!useAutoSlide || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, useAutoSlide]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative ${heightClass} bg-gray-100`}>
      <CustomImage
        src={images[currentImageIndex]}
        alt={alt}
        className="w-full h-full object-cover"
        fill={true}
      />

      {/* Bullet Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex
                  ? bulletActiveColor
                  : bulletInactiveColor
              }`}
            />
          ))}
        </div>
      )}

      {/* Badge */}
      {badgeText && (
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${badgeColorClass}`}
          >
            {badgeText}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
