import { memo } from "react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";

interface SubCategoryCardProps {
  id: string;
  name: string;
  image: string;
}

const SubCategoryCard = ({ id, name, image }: SubCategoryCardProps) => {
  return (
    <div
      key={id}
      className="group h-52 cursor-pointer rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative h-full w-full aspect-square bg-gradient-to-br from-white-50 to-white-100 flex items-center justify-center">
        <ImageWithFallback
          src={image}
          alt={name}
          className="object-contain transition-transform duration-500 group-hover:scale-110"
          // loading="lazy"
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
};

export default memo(SubCategoryCard);
