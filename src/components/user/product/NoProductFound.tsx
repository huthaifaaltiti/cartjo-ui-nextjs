"use client";

import {
  AlertCircle,
  ArrowLeft,
  Package,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";
import { memo, useState } from "react";
import SearchSuggestions from "./SearchSuggestions";
import ProductCard from "./ProductCard";

const suggestedProducts = [
  {
    id: 1,
    name: "Premium Notebook Set",
    price: 45,
    currency: "JOD",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop",
    rating: 4.5,
    originalPrice: 60,
    discount: 25,
  },
  {
    id: 2,
    name: "Elegant Pen Collection",
    price: 89,
    currency: "JOD",
    image:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop",
    rating: 4.8,
    originalPrice: null,
    discount: 0,
  },
  {
    id: 3,
    name: "Office Organizer Kit",
    price: 125,
    currency: "JOD",
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop",
    rating: 4.3,
    originalPrice: 150,
    discount: 17,
  },
  {
    id: 4,
    name: "Designer Desk Accessories",
    price: 78,
    currency: "JOD",
    image:
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop",
    rating: 4.6,
    originalPrice: 95,
    discount: 18,
  },
];

const NoProductFound = ({
  productId,
  onGoBack,
  onRetry,
  onSearchSimilar,
  showSuggestions = true,
}: {
  productId: string;
  onGoBack: () => void;
  onRetry: () => void;
  onSearchSimilar: (searchQuery: string) => void;
  showSuggestions: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSimilar?.(searchQuery);
    }
  };

  const handleAddToWishlist = (productId: string) => {
    console.log(`Added product ${productId} to wishlist`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Main Error Section */}
      <div className="text-center space-y-6 mb-12">
        {/* Animated Icon */}
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="relative z-10 w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We couldn't find the product you're looking for. It might have been
            moved, discontinued, or the link might be broken.
          </p>
          {productId && (
            <p className="text-sm text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded-lg inline-block">
              Product ID: {productId}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <button
            onClick={onGoBack}
            className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <button
            onClick={onRetry}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Search for Something Else
        </h3>
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
            //   onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {showSuggestions && (
        <div className="space-y-8">
          {/* Search Suggestions */}
          <SearchSuggestions />

          {/* Recommended Products */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                You Might Also Like
              </h2>
              <p className="text-gray-600">
                Check out these popular products from our collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Need Help Finding Something?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Our customer support team is here to help you find exactly what
              you're looking for. Get personalized recommendations and
              assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NoProductFound);
