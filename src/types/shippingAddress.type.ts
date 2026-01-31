import { MapLocation } from "./mapLocation.type";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  town: string;
  street: string;
  building?: string;
  additionalInfo?: string;
  mapLocation?: MapLocation;
}
