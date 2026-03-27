import { Name } from "./common";
import { Media } from "./media.type";
import { VariantServer } from "./product.type";

export interface CartItem {
  name: Name;
  price: number;
  productId: string;
  _id?: string;
  mainImage: Media;
  slug: string;
  category: {
    _id: string;
    slug: string;
  };
  subCategory: {
    _id: string;
    slug: string;
  };
  quantity: number;
  total: number;
  variant: VariantServer;
}
