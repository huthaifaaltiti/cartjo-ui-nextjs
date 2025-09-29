import { Actor } from "./common";

export interface Comment {
  _id: string;
  content: string;
  rating: number | null;
  userId: null | Actor;
  productId: string;
  isDeleted: boolean;
  isUpdated: boolean;
  isPurchasedProduct: boolean;
  unDeletedBy: null | Actor;
  createdBy: null | Actor;
  createdAt: Date;
  updatedAt: null | Date;
  deletedAt: null | Date;
  unDeletedAt: null | Date;
}
