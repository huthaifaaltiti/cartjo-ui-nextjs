"use client";

import { memo } from "react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";

interface SubCategoryCardProps {
  id: string;
  name: string;
  image: string;
  onClick?: (id: string) => void;
}

const SubCategoryCard = ({
  id,
  name,
  image,
  onClick,
}: SubCategoryCardProps) => {
  return (
    <div
      key={id}
      onClick={() => onClick?.(id)}
      className="group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <ImageWithFallback
          src={image}
          alt={name}
          className="object-contain w-3/4 h-3/4 transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>
  );
};

export default memo(SubCategoryCard);
