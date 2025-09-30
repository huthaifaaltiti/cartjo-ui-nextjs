import { memo, useState } from "react";
import {
    Heart,
    Minus,
    Plus,
    RotateCcw,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck,
} from "lucide-react";
import { Product } from "@/types/product.type";

interface Props {
  product: Product;
}

const ProductDetailsContent = ({ product }: Props) => {
  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(1);
  const [isWishListed, setIsWishListed] = useState(product.isWishListed);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleQuantityChange = (action: string) => {
    if (action === "increase" && quantity < product.availableCount) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleWishlist = () => {
    setIsWishListed(!isWishListed);
  };

  const discountedPrice =
    product.discountRate > 0
      ? product.price * (1 - product.discountRate / 100)
      : product.price;

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 relative group">
            <img
              src={selectedImage}
              alt={product.name.en}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.discountRate > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{product.discountRate}%
              </div>
            )}
            <button
              onClick={toggleWishlist}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                isWishListed
                  ? "bg-red-100 text-red-500"
                  : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isWishListed ? "fill-current" : ""}`}
              />
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto">
            {[product.mainImage, ...product.images].map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === image
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name.en} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name.en}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(product.ratings)}
              </div>
              <span className="text-sm text-gray-600">
                ({product.ratings} reviews)
              </span>
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {discountedPrice.toFixed(2)} {product.currency}
              </span>
              {product.discountRate > 0 && (
                <span className="text-xl text-gray-500 line-through">
                  {product.price.toFixed(2)} {product.currency}
                </span>
              )}
            </div>
            <p className="text-sm text-green-600 font-medium">
              ✓ In stock ({product.availableCount} available)
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description.en}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= product.availableCount}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <button className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Buy Now
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over 50 JOD</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <RotateCcw className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-gray-600">30 days return policy</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-gray-600">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductDetailsContent);
