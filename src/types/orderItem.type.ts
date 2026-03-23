import { Name } from "./common";
import { Media } from "./media.type";

export interface VariantAttribute {
  key: string;
  value: string;
}

export interface OrderItemVariant {
  variantId: string;
  sku: string;
  attributes: VariantAttribute[];
  description?: Name;
  mainImage?: Media;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  price: number;
  quantity: number;

  name: Name;
  description?: Name;
  mainImage?: Media;

  variant?: OrderItemVariant;
}
