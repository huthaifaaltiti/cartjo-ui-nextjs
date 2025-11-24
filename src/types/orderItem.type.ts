import { Name } from "./common";
import { OrderProduct } from "./orderProduct.type";

export interface OrderItem {
  productId: OrderProduct;
  price: number;
  quantity: number;
  name: Name;
}
