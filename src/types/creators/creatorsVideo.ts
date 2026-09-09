import { Actor } from "../common";
import { Media } from "../media.type";

export interface CreatorsVideo {
  _id: string;
  title: {
    ar: string;
    en: string;
  };
  type: string;
  media: Media;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: null | Actor;
  createdAt: Date;
  updatedAt: null | Date;
}
