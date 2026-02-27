import { Description, Name } from "./common";
import { Currency } from "@/enums/currency.enum";
import { Category } from "./category.type";
import { SubCategory } from "./subCategory";
import { User } from "./user";
import { Media } from "./media.type";
import { ProductVariantAttributeKey } from "@/enums/productVariantAttributeKey.enum";

export interface Product {
  _id: string;
  __v?: number;
  name: Name;
  description: Description;
  mainImage: Media;
  typeHints: string[];
  categoryId: Category;
  subCategoryId: SubCategory;
  comments: [];
  variants: VariantServer[];
  tags: string[];
  random: number;
  viewCount: number;
  ratingsAverage: number;
  ratingsCount: number;
  totalSellCount: number;
  weeklyViewCount: number;
  favoriteCount: number;
  weeklyFavoriteCount: number;
  weeklyScore: number;
  slug: string;
  isWishListed: boolean;
  isAvailable: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  unDeletedAt: Date | null;
  deletedBy: string | null;
  unDeletedBy: string | null;
  createdAt: Date;
  createdBy: User | null;
  updatedAt: Date | null;
  updatedBy: string | null;
}

export interface VariantAttribute {
  key: ProductVariantAttributeKey;
  value: string;
}

export interface Variant {
  sku?: string;
  description?: Description;
  variantId?: string;
  availableCount?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: Date | null;
  unDeletedAt?: Date | null;
  description_ar: string;
  ratingsAverage: number;
  ratingsCount: number;
  description_en: string;
  price: number;
  currency: Currency;
  discountRate: number;
  totalAmountCount: number;
  mainImage: {
    file: File | null;
    url: string;
  };
  images?: {
    files: File[];
    urls: string[];
  };
  attributes: VariantAttribute[];
}

export interface VariantServer extends Omit<Variant, "mainImage" | "images"> {
  variantId: string;
  sku: string;
  attributes: VariantAttribute[];
  description: Description;
  price: number;
  currency: Currency;
  discountRate: number;
  priceAfterDiscount: number;
  totalAmountCount: number;
  availableCount: number;
  ratingsAverage: number;
  ratingsCount: number;
  mainImage: Media;
  images?: Media[];
  isActive: boolean;
  isAvailable: boolean;
  isDeleted: boolean;
  deletedBy: string;
  deletedAt: Date | null;
  unDeletedAt: Date | null;
}
