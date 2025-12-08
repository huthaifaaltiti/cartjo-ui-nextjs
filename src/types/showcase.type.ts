import { Actor, TranslatedText } from "./common";
import { Product } from "./product.type";

export interface Showcase {
  _id: string;
  title: TranslatedText;
  description: TranslatedText;
  showAllButtonText: TranslatedText;
  showAllButtonLink: string;
  priority: number | null;
  type: string;
  items: Product[];
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
