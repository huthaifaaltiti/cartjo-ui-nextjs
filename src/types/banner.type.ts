import { Actor, TranslatedText } from "./common";
import { Media } from "./media.type";

export interface Banner {
  _id: string;
  title: TranslatedText;
  withAction: boolean;
  link: string | null;
  media: {
    ar: Media;
    en: Media;
  };
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isDeleted: boolean;
  unDeletedBy: null | Actor;
  createdBy: null | Actor;
  createdAt: Date;
  updatedAt: null | Date;
  deletedAt: null | Date;
  unDeletedAt: null | Date;
}
