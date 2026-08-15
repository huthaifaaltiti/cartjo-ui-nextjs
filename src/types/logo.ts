import { Actor, Name } from "./common";
import { Media } from "./media.type";
import { SubCategory } from "./subCategory";

export type LogoType = "main" | "creators";
export interface Logo {
  _id: string;
  name: Name;
  altText: Name;
  media: {
    ar: Media;
    en: Media;
  };
  type: LogoType;
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
