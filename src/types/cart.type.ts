import { CartItem } from "./cartItem.type";
import { User } from "./user";

export interface Cart {
  _id: string;
  userId: string;
  totalAmount: number;
  items: CartItem[];
  productsCount: number;
  deletedAt: null | Date;
  restoredAt: null | Date;
  deletedBy: null | User | string;
  restoredBy: null | User | string;
  createdBy: null | Partial<User>;
  updatedBy: null | Partial<User>;
  createdAt: Date;
  updatedAt: Date | null;
  __v?: number;
}
