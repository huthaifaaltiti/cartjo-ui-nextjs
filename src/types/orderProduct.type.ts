import { Description, Name } from "./common";
import { Currency } from "@/enums/currency.enum";

export interface OrderProduct {
  _id: string;
  name: Name;
  description: Description;
  mainImage: string;
  currency: Currency;
  ratings: number;
}
