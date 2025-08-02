import { Actor, TranslatedText } from "./common";
import { Media } from "./media.type";

export interface Banner {
  _id: string;
  title: TranslatedText;
  withAction: boolean;
  ctaBtn: {
    label: TranslatedText;
    link: string;
    labelClr: string;
    bgClr: string;
  } | null;
  media: Media;
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
