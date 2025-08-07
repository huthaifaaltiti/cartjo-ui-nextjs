import { Actor, Name } from "./common";
import { Media } from "./media.type";
import { SubCategory } from "./subCategory";

export interface Category {
  _id: string;
  name: Name;
  media: {
    ar: Media;
    en: Media;
  };
  subCategories: SubCategory[];
  slug: string | undefined;
  isActive: boolean;
  isDeleted: boolean;
  unDeletedBy: null | Actor;
  createdBy: null | Actor;
  createdAt: Date;
  updatedAt: null | Date;
  deletedAt: null | Date;
  unDeletedAt: null | Date;
}
