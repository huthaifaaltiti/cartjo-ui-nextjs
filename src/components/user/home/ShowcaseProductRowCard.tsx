"use client";

import { memo, useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { Product } from "@/types/product.type";

const ShowcaseProductRowCard = ({
  item,
  isArabic = false,
}: {
  item: Product;
  isArabic: boolean;
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountedPrice = item?.discountRate
    ? item.price - (item.discountRate / 100) * item.price
    : item.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div
      className={`w-full h-full group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 ${
        isHovered ? "scale-[1.01]" : "scale-100"
      } border border-gray-100 hover:border-gray-200 flex items-stretch min-h-[180px]`}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className={`absolute top-2 left-2 z-10 p-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
          isWishlisted
            ? "bg-primary-50 shadow-md transform scale-105"
            : "bg-white-50/80 hover:bg-white-50 shadow-sm hover:shadow-md"
        } hover:scale-105 active:scale-95`}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            isWishlisted
              ? "text-primary-500 fill-primary-500"
              : "text-gray-600 hover:text-primary-500"
          }`}
        />
      </button>

      {/* Discount Badge */}
      {item?.discountRate > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold shadow-sm">
            -{item.discountRate}%
          </div>
        </div>
      )}

      {/* Left Image Section */}
      <div className="w-2/5 flex-shrink-0 p-3">
        <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <ImageWithFallback
            src={item?.mainImage}
            alt={isArabic ? item?.name?.ar : item?.name?.en}
            className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105`}
          />
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex-1 p-3 pr-4 flex flex-col justify-between min-w-0">
        {/* Product Title */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-md leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {isArabic ? item?.name?.ar : item?.name?.en}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 transition-all duration-300 ${
                    i < Math.floor(item?.ratings || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600">
              ({item?.ratings || 0})
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="space-y-2">
          {/* Price */}
          <div>
            {item?.discountRate > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold text-green-600">
                  {item?.currency}
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {item?.currency}
                  {formatPrice(item?.price)}
                </span>
              </div>
            ) : (
              <div className="text-xl font-bold text-gray-900">
                {item?.currency}
                {formatPrice(item?.price)}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button className="w-full h-10 group/btn bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 font-medium py-2 px-1 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md flex items-center justify-center gap-1 text-xs">
            <ShoppingCart className="w-4 h-4" />
            <span className="font-semibold text-xs">ADD TO CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ShowcaseProductRowCard);
