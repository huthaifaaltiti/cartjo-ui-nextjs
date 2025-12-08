
I have 2 products card make one for dashboard and one for end user ""

Edit
I'll create two different product cards - one for the dashboard (admin/management view) and one for the end user (customer-facing view).


Dashboard and Customer Product Cards
Interactive artifact 

Dashboard and Customer Product Cards
Interactive artifact ∙ Version 2 
I've created two distinct product cards for you:

1. Dashboard Product Card (Admin/Management View)
Features:

Management Actions: Edit, Delete, Activate/Deactivate, Duplicate
Detailed Analytics: Stock levels, sales count, favorites, creation date
Status Indicators: Active/Inactive, Stock status (In Stock/Low Stock/Out of Stock)
Administrative Info: Creator details, internal tags, type hints
Image Gallery: Multiple images with navigation
Comprehensive Data: All backend data visible for management
2. Customer Product Card (End User/Shopping View)
Features:

Shopping Actions: Add to cart, favorite, share
Customer-Focused Info: Price, ratings, reviews, descriptions
Visual Appeal: Discount badges, star ratings, attractive layout
Interactive Elements: Quantity selector, image gallery
Purchase Incentives: Stock urgency indicators, discount highlights
Clean Design: Simplified view focused on buying decisions
Key Differences:
Dashboard Card:

Shows internal metrics (sell count, creator info, admin tags)
Management actions (edit, delete, activate/deactivate)
Stock management focus
Administrative status indicators
Customer Card:

Shopping-focused actions (add to cart, wishlist)
Customer ratings and reviews
Discount and pricing emphasis
Purchase quantity controls
Social features (share, favorite)
Both cards are fully responsive and include:

Error handling for images
Smooth transitions and hover effects
TypeScript-ready prop interfaces
Modular design for easy customization
You can switch between the two views using the tabs in the demo. Each card serves its specific purpose while maintaining a consistent design language.







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
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Share2,
  HeartIcon,
} from "lucide-react";

const CustomerProductCard = ({
  item: product = sampleProduct,
  onAddToCart,
  onToggleFavorite,
  onShare,
  isFavorite = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const allImages = [product.mainImage, ...product.images];
  const discountedPrice = product.price * (1 - product.discountRate / 100);

  const handleAddToCart = () => {
    onAddToCart && onAddToCart(product._id, quantity);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite && onToggleFavorite(product._id);
  };

  const handleShare = () => {
    onShare && onShare(product._id);
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          size={16}
          className="text-yellow-400 fill-current opacity-50"
        />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
      {/* Product Image Gallery */}
      <div className="relative h-64 bg-gray-100">
        <CustomImage
          src={allImages[currentImageIndex]}
          alt={product.name.en}
          className="w-full h-full object-cover"
          fill={true}
        />

        {/* Discount Badge */}
        {product.discountRate > 0 && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              -{product.discountRate}%
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart size={18} className={isFavorite ? "fill-current" : ""} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/80 text-gray-600 rounded-full backdrop-blur-sm hover:bg-blue-50 hover:text-blue-500 transition-colors"
          >
            <Share2 size={18} />
          </button>
        </div>

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

        {/* Stock Status */}
        {product.availableCount < 10 && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
              Only {product.availableCount} left
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <span>{product.categoryId.name.en}</span>
          <span>•</span>
          <span>{product.subCategoryId.name.en}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {product.name.en}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {renderStarRating(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountRate > 0 && (
            <span className="text-lg text-gray-500 line-through">
              ${product.price}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description.en}
        </p>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="flex items-center space-x-3 pt-2">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
