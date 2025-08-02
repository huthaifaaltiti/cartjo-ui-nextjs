import { Actor, TranslatedText } from "./common";
import { Media } from "./media.type";

export interface Banner {
  _id: string;
  label: TranslatedText;
  title: TranslatedText;
  subTitle: TranslatedText;
  ctaBtn: {
    text: string;
    link: string;
  };
  offerDetails: {
    preSalePrice: number;
    afterSalePrice: number;
    desc: string;
  };
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
