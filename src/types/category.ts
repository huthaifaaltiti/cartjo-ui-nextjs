import { Actor, Name } from "./common";
import { Media } from "./media.type";
import { SubCategory } from "./subCategory";

export interface Category {
  _id: string;
  name: Name;
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
