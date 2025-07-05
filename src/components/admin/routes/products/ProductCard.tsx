"use client";

import { memo, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Tag,
  DollarSign,
  Calendar,
  User,
  MoreVertical,
} from "lucide-react";

import { formatDate } from "@/utils/formatDate";

import { Product } from "@/types/product.type";
import { DeletingResponse, SwitchActiveStatusResponse } from "@/types/common";

import ProductCardActions from "./ProductCardActions";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ImageGallery from "../../shared/ImageGallery";

type DashboardProductCardProps = {
  item: Product;
  deleteProduct: (token: string, prodId: string) => Promise<DeletingResponse>;
  unDeleteProduct: (token: string, prodId: string) => Promise<DeletingResponse>;
  switchProductActiveStatus: (
    token: string,
    lang: string,
    isActive: boolean,
    id: string
  ) => Promise<SwitchActiveStatusResponse>;
};

const DashboardProductCard = ({
  item: product,
  deleteProduct,
  switchProductActiveStatus,
  unDeleteProduct,
}: DashboardProductCardProps) => {
  const t = useTranslations();
  const locale = useLocale();

  const [showActions, setShowActions] = useState(false);

  const allImages = [product.mainImage, ...product.images];

  const getStockStatus = () => {
    const percentage =
      (product.availableCount / product.totalAmountCount) * 100;

    if (percentage > 50)
      return {
        color: "text-green-600",
        bg: "bg-green-100",
        text: t("general.items.states.inStock"),
      };
    if (percentage > 20)
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        text: t("general.items.states.lowStock"),
      };

    return {
      color: "text-red-600",
      bg: "bg-red-100",
      text: t("general.items.states.outOfStock"),
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Header with Actions */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              product.isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {product.isActive
              ? t("general.items.states.active")
              : t("general.items.states.inactive")}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}
          >
            {stockStatus.text}
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative">
          <Button
            onClick={() => setShowActions(!showActions)}
            className="bg-transparent shadow-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </Button>

          {showActions && (
            <ProductCardActions
              deleteFn={deleteProduct}
              unDeleteFn={unDeleteProduct}
              switchActiveStatusFn={switchProductActiveStatus}
              product={product}
              setShowActions={setShowActions}
            />
          )}
        </div>
      </div>

      {/* Product Image Gallery */}
      <div className="w-full">
        <ImageGallery
          images={allImages}
          alt={product.name.en}
          badgeText={product.typeHint}
          bulletActiveColor="bg-white-50"
          bulletInactiveColor="bg-black-50/30"
          badgeColorClass="bg-primary-50/50 text-primary-800"
          heightClass="h-20"
          interval={5000}
          useAutoSlide={true}
        />
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-4">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 capitalize">
            {product.name.en}
          </h3>
          <p className="text-xs text-gray-500 mb-2 capitalize">
            {product.categoryId.name.en} • {product.subCategoryId.name.en}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2 capitalize">
            {product.description.en}
          </p>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <DollarSign size={14} className="text-gray-500" />

            <span className="text-sm font-bold text-gray-900">
              {product.price} {product.currency}
            </span>
          </div>

          <div className="text-right text-sm">
            <p className="text-gray-500">{t("general.items.stock")}</p>
            <p className="font-semibold text-gray-900">
              {product.availableCount}/{product.totalAmountCount}
            </p>
          </div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                <Tag size={10} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
          {/* Sold Count */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center space-x-1">
              <ShoppingCart size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {product.sellCount}
              </span>
            </div>
            <p className="text-xs text-gray-500">{t("general.items.sold")}</p>
          </div>

          {/* Favorites */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center space-x-1">
              <Heart size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {product.favoriteCount}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {t("general.items.favorites")}
            </p>
          </div>

          {/* Created At */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center space-x-1">
              <Calendar size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {formatDate(product.createdAt, locale)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {t("general.others.created")}
            </p>
          </div>

          {/* Updated At */}
          <div className="flex flex-col items-center justify-center text-center col-span-3 sm:col-span-1">
            <div className="flex items-center justify-center space-x-1">
              <Calendar size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {product.updatedAt
                  ? formatDate(product.updatedAt, locale)
                  : "NA"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {t("general.others.updated")}
            </p>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <User size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">
            {t("general.others.createdBy")}{" "}
            {product?.createdBy
              ? `${product.createdBy.firstName} ${product.createdBy.lastName}`
              : t("general.others.unknown")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardProductCard);
