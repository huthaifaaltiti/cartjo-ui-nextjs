import { Actor } from "./common";
import { Media } from "./media.type";
import { SubCategory } from "./subCategory";

export interface Logo {
  _id: string;
  name: string;
  altText: string;
  media: Media;
  subCategories: SubCategory[];
  isActive: boolean;
  isDeleted: boolean;
  unDeletedBy: null | Actor;
  createdBy: null | Actor;
  createdAt: Date;
  updatedAt: null | Date;
  deletedAt: null | Date;
  unDeletedAt: null | Date;
}
