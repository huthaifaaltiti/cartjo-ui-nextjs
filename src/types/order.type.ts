import { Currency } from "@/enums/currency.enum";
import { OrderItem } from "./orderItem.type";
import { ShippingAddress } from "./shippingAddress.type";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";
import { OrderDeliveredByStatus } from "@/enums/orderDeliveredByStatus.enum";

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  currency: Currency;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  email: string;
  merchantReference: string;
  shippingAddress: ShippingAddress;
  isDeleted: boolean;
  isUpdated: boolean;
  deletedAt: Date | null;
  updatedAt: Date | null;
  restoredAt: Date | null;
  deletedBy: string | null;
  restoredBy: string | null;
  isDelivered: boolean;
  isPaid: boolean;
  deliveredAt: Date | null;
  deliveryStatus: OrderDeliveryStatus;
  deliveredByStatus: OrderDeliveredByStatus;
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  updatedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  createdAt: Date;
  __v?: number;
}
