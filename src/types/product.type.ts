import { Description, Name } from "./common";

import { Currency } from "@/enums/currency.enum";
import { TypeHint } from "@/enums/typeHint.enum";

import { Category } from "./category";
import { SubCategory } from "./subCategory";
import { User } from "./user";
import { Media } from "./media.type";

export interface Product {
  _id: string;
  __v?: number;
  name: Name;
  description: Description;
  images: string[];
  mediaListIds?: Media[];
  mainImage: string;
  mainMediaId: Media;
  price: number;
  currency: Currency;
  discountRate: number;
  totalAmountCount: number;
  availableCount: number;
  sellCount: number;
  favoriteCount: number;
  typeHint: TypeHint;
  tags: string[];
  slug: string;
  categoryId: Category;
  subCategoryId: SubCategory;
  isAvailable: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  unDeletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy: User | null;
  updatedBy: string | null;
  deletedBy: string | null;
  unDeletedBy: string | null;
}
