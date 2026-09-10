import { Currency } from "@/enums/currency.enum";
import { Actor, TranslatedText } from "../common";
import { Media } from "../media.type";
import { CreatorStoreBusinessType } from "@/enums/creators/creatorStoreBusinessType.enum";
import { CreatorStoreStatus } from "@/enums/creators/creatorStoreStatus.enum";
import { HandleAvailabilityReason } from "@/enums/creators/handleAvailabilityReason.enum";
import { StoreSocialLinks } from "../storeSocialLinks";

export interface StorePayoutInfo {
  bankName?: string | null;
  accountHolderName?: string | null;
  iban?: string | null;
  accountNumber?: string | null;
  cliqAlias?: string | null;
  currency?: Currency | string | null;
}

export interface StoreGeoPoint {
  lat?: number | null;
  lng?: number | null;
  name?: string | null;
}

export interface StorePickupAddress {
  contactName?: string | null;
  phone?: string | null;
  countryCode?: string | null;
  country?: string | null;
  city?: string | null;
  town?: string | null;
  street?: string | null;
  building?: string | null;
  notes?: string | null;
  additionalInfo?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: StoreGeoPoint | null;
  mapLocation?: StoreGeoPoint | null;
}

interface StorePolicies {
  returnPolicy?: TranslatedText | null;
  shippingPolicy?: TranslatedText | null;
  privacyPolicy?: TranslatedText | null;
}

interface StoreStats {
  productsCount?: number;
  ordersCount?: number;
  followersCount?: number;
  rating?: number;
  reviewsCount?: number;
}

interface StorePayoutSummary {
  totalEarned?: number;
  totalPaidOut?: number;
  pendingBalance?: number;
  lastPayoutAt?: Date | null;
}

export interface CreatorStore {
  _id: string;
  ownerId: string | Actor;
  name: TranslatedText;
  slug: string;
  handle: string;
  bio?: TranslatedText | null;
  tagline?: TranslatedText | null;
  logo: Media;
  banner: Media;
  /** Hex accent color for the storefront theme, e.g. `#1E88E5`. */
  themeColor?: string | null;
  countryCode?: string | null;
  phone?: string | null;
  email?: string | null;
  socialLinks: StoreSocialLinks;
  currency: Currency;
  /**
   * Percentage of every sale kept by CartJO. Managed by admins only — a
   * creator can never change this through the self-service endpoints.
   */
  commissionRate: number;
  /** Minimum basket value (in {@link currency}) required to check out. */
  minOrderAmount: number;
  businessType: CreatorStoreBusinessType;
  /** Commercial registration / tax number. Hidden from public responses. */
  registrationNumber?: string | null;
  taxId?: string | null;
  payoutInfo?: StorePayoutInfo;
  pickupAddress: StorePickupAddress;
  policies: StorePolicies;
  status: CreatorStoreStatus;
  /** Human-readable reason for the current REJECTED / SUSPENDED status. */
  statusReason?: string | null;
  /** Verified badge — set by an admin after KYC / document checks. */
  isVerified: boolean;
  verifiedAt?: Date | null;
  verifiedBy?: string | Actor | null;
  submittedForReviewAt?: Date | null;
  reviewedAt?: Date | null;
  reviewedBy?: string | Actor | null;
  suspendedAt?: Date | null;
  suspendedBy?: string | Actor | null;
  closedAt?: Date | null;
  /** Temporary "away" mode — store stays ACTIVE but stops accepting orders. */
  vacationMode: boolean;
  vacationMessage?: TranslatedText | null;
  vacationUntil?: Date | null;
  stats: StoreStats;
  payoutSummary: StorePayoutSummary;
  /** Editorial flag to feature the store on the marketplace home. */
  isFeatured: boolean;
  /** Private notes visible to admins only. */
  internalNotes?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;
  unDeletedAt?: Date | null;
  deletedBy?: string | Actor | null;
  unDeletedBy?: string | Actor | null;
  createdBy: null | Actor;
  updatedBy?: null | Actor;
  createdAt: Date;
  updatedAt: null | Date;
  handleChangedAt?: Date | string | null;
  handleChangeCount?: number;
  previousHandles?: string[];
  nextChangeAllowedAt?: Date | string | null;
}

export { HandleAvailabilityReason };

export interface HandleAvailabilityData {
  handle: string;
  available: boolean;
  reason: HandleAvailabilityReason;
}

export interface ChangeHandlePayload {
  handle: string;
  lang?: string;
}

export interface ChangeHandleData {
  handle: string;
  previousHandle: string | null;
  handleChangedAt: string;
  nextChangeAllowedAt: string | null;
  changeCount: number;
  cooldownDays: number;
}
