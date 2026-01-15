import { PreferredLanguage } from "@/enums/Preferred-language.enum";

export interface UserContext {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  preferredLang: PreferredLanguage;
  lastCalculatedAt: string;
  createdAt: string;
  updatedAt: string;
  dateJoined: string;
  counters: {
    wishlistItemsCount: number;
    cartItemsCount: number;
  };
  __v: number;
}
