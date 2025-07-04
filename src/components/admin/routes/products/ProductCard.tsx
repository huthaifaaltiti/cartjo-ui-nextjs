"use client";

import { memo, useState } from "react";
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Heart,
  ShoppingCart,
  Tag,
  Package,
  DollarSign,
  Calendar,
  User,
  MoreVertical,
} from "lucide-react";

import CustomImage from "../../shared/CustomImage";
import { Product } from "@/types/product.type";
import { DeletingResponse } from "@/types/common";
import { formatDate } from "@/utils/formatDate";

type DashboardProductCardProps = {
  item: Product;
  deleteProduct: (token: string, prodId: string) => Promise<DeletingResponse>;
};

const DashboardProductCard = ({
  item: product,
  deleteProduct,
}: // unDeleteProduct,
// accessToken,
// switchProductActiveStatus,
// queryKey,
DashboardProductCardProps) => {
  const [showActions, setShowActions] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [product.mainImage, ...product.images];

  const handleAction = (action: string) => {
    console.log(`${action} action triggered for product:`, product._id);
    setShowActions(false);

    // Handle actual actions
    switch (action) {
      case "delete":
        deleteProduct && deleteProduct(product._id);
        break;
      case "toggle-active":
        switchProductActiveStatus && switchProductActiveStatus(product._id);
        break;
      case "edit":
        // Handle edit action
        break;
      case "duplicate":
        // Handle duplicate action
        break;
      default:
        break;
    }
  };

  const getStockStatus = () => {
    const percentage =
      (product.availableCount / product.totalAmountCount) * 100;
    if (percentage > 50)
      return { color: "text-green-600", bg: "bg-green-100", text: "In Stock" };
    if (percentage > 20)
      return {
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        text: "Low Stock",
      };
    return { color: "text-red-600", bg: "bg-red-100", text: "Out of Stock" };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
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
            {product.isActive ? "Active" : "Inactive"}
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}
          >
            {stockStatus.text}
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => handleAction("edit")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
                >
                  <Edit size={16} />
                  <span>Edit Product</span>
                </button>
                <button
                  onClick={() => handleAction("toggle-active")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
                >
                  {product.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{product.isActive ? "Deactivate" : "Activate"}</span>
                </button>
                <button
                  onClick={() => handleAction("duplicate")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
                >
                  <Package size={16} />
                  <span>Duplicate</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleAction("delete")}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-2 text-red-600"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Image Gallery */}
      <div className="relative h-48 bg-gray-100">
        <CustomImage
          src={allImages[currentImageIndex]}
          alt={product.name.en}
          className="w-full h-full object-cover"
          fill={true}
        />

        {/* Image Navigation */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {product.typeHint}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-4">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {product.name.en}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            {product.categoryId.name.en} • {product.subCategoryId.name.en}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description.en}
          </p>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign size={18} className="text-gray-500" />
            <span className="text-xl font-bold text-gray-900">
              {product.price} {product.currency}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Stock</p>
            <p className="font-semibold text-gray-900">
              {product.availableCount}/{product.totalAmountCount}
            </p>
          </div>
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ShoppingCart size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {product.sellCount}
              </span>
            </div>
            <p className="text-xs text-gray-500">Sold</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Heart size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {product.favoriteCount}
              </span>
            </div>
            <p className="text-xs text-gray-500">Favorites</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Calendar size={14} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-900">
                {formatDate(product.createdAt, "en")}
              </span>
            </div>
            <p className="text-xs text-gray-500">Created</p>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <User size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">
            Created by{" "}
            {product?.createdBy
              ? `${product.createdBy.firstName} ${product.createdBy.lastName}`
              : "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardProductCard);
