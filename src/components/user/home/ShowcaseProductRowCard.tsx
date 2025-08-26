"use client";

import { memo, useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import ImageWithFallback from "@/components/shared/ImageWithFallback";

// Mock product data for demo
const mockProduct = {
  mainImage:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
  name: { en: "Premium Wireless Headphones", ar: "سماعات لاسلكية فاخرة" },
  discountRate: 25,
  ratings: 4.5,
  price: 299,
  currency: "$",
};

const ShowcaseProductRowCard = ({ item = mockProduct, isArabic = false }) => {
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
      className={`w-full group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 ${
        isHovered ? "scale-[1.02]" : "scale-100"
      } border border-gray-100 hover:border-gray-200`}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={() => setIsWishlisted(!isWishlisted)}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
          isWishlisted
            ? "bg-primary-50 shadow-lg transform scale-110"
            : "bg-white/80 hover:bg-white shadow-md hover:shadow-lg"
        } hover:scale-110 active:scale-95`}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            isWishlisted
              ? "text-primary-500 fill-primary-500"
              : "text-gray-600 hover:text-primary-500"
          }`}
        />
      </button>

      {/* Discount Badge */}
      {item?.discountRate > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
            -{item.discountRate}%
          </div>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative p-6 pb-4">
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group-hover:shadow-inner transition-all duration-500">
          <ImageWithFallback
            src={item?.mainImage}
            alt={isArabic ? item?.name?.ar : item?.name?.en}
            className={`object-contain transition-all duration-700 group-hover:scale-110 ${
              isHovered ? "filter brightness-105" : ""
            }`}
            style={{
              filter: isHovered
                ? "drop-shadow(0 10px 20px rgba(0,0,0,0.1))"
                : "none",
            }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 pb-6 space-y-4">
        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {isArabic ? item?.name?.ar : item?.name?.en}
        </h3>

        {/* Rating Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-all duration-300 ${
                  i < Math.floor(item?.ratings || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : i < (item?.ratings || 0)
                    ? "text-yellow-400 fill-yellow-400 opacity-50"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {item?.ratings || 0}
          </span>
        </div>

        {/* Price Section */}
        <div className="space-y-1">
          {item?.discountRate > 0 ? (
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-green-600">
                  {item?.currency}
                  {formatPrice(discountedPrice)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg text-gray-400 line-through font-medium">
                  {item?.currency}
                  {formatPrice(item?.price)}
                </span>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save {item?.currency}
                  {formatPrice(item?.price - discountedPrice)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {item?.currency}
              {formatPrice(item?.price)}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full h-14 group/btn bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white-50 font-semibold py-3.5 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-1">
          <div className="bg-white/20 p-1.5 rounded-lg group-hover/btn:bg-white/30 transition-all duration-300 group-hover/btn:scale-110">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <span className="text-base font-bold tracking-wide">ADD TO CART</span>
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${
          isHovered
            ? "bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"
            : ""
        }`}
      />
    </div>
  );
};

export default memo(ShowcaseProductRowCard);
