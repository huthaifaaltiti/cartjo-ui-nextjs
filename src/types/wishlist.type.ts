import { Product } from "./product.type";
import { User } from "./user";

export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
  productsCount: number;
  deletedAt: null | Date;
  restoredAt: null | Date;
  deletedBy: null | User | string;
  restoredBy: null | User | string;
  createdBy: null | Partial<User>;
  updatedBy: null | Partial<User>;
  createdAt: Date;
  updatedAt: Date | null;
}
