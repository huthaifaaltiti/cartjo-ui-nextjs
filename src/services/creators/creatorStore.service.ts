import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataResponse } from "@/types/service-response.type";
import {
  CreatorStore,
  ChangeHandleData,
  ChangeHandlePayload,
  HandleAvailabilityData,
} from "@/types/creators/creatorStore";
import { Currency } from "@/enums/currency.enum";
import { CreatorStoreBusinessType } from "@/enums/creators/creatorStoreBusinessType.enum";
import { authFetcher } from "@/utils/authFetcher";
import { Locale } from "@/enums/locale.enum";

interface FetchCreatorStoreParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  type?: string;
  fetcher: (url: string) => Promise<DataResponse<CreatorStore>>;
}

export const fetchCreatorStore = async ({
  lang = Locale.EN,
  fetcher,
}: FetchCreatorStoreParams): Promise<DataResponse<CreatorStore>> => {
  const url = new URL(API_ENDPOINTS.CREATORS.CREATOR_STORE);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString());
};

export interface CreateCreatorStorePayload {
  name_ar: string;
  name_en: string;
  handle: string;
  bio_ar?: string;
  bio_en?: string;
  tagline_ar?: string;
  tagline_en?: string;
  themeColor?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  currency?: Currency;
  minOrderAmount?: number;
  businessType?: CreatorStoreBusinessType;
  registrationNumber?: string;
  taxId?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_tiktok?: string;
  social_youtube?: string;
  social_x?: string;
  social_snapchat?: string;
  social_whatsapp?: string;
  social_telegram?: string;
  social_website?: string;
  logo?: File | null;
  banner?: File | null;
  lang?: string;
}

export const createCreatorStore = async (
  payload: CreateCreatorStorePayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorStore>> = authFetcher,
): Promise<DataResponse<CreatorStore>> => {
  const formData = new FormData();

  const fileFields = ["logo", "banner"];
  Object.entries(payload).forEach(([key, value]) => {
    if (fileFields.includes(key)) return;
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });

  if (payload.logo) {
    formData.append("logo", payload.logo);
  }
  if (payload.banner) {
    formData.append("banner", payload.banner);
  }

  return fetcher(API_ENDPOINTS.CREATORS.CREATE_STORE, {
    method: "POST",
    body: formData,
  });
};

export interface UpdateCreatorStoreProfilePayload {
  name_ar?: string;
  name_en?: string;
  bio_ar?: string;
  bio_en?: string;
  tagline_ar?: string;
  tagline_en?: string;
  themeColor?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  currency?: Currency;
  minOrderAmount?: number;
  businessType?: CreatorStoreBusinessType;
  registrationNumber?: string;
  taxId?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_tiktok?: string;
  social_youtube?: string;
  social_x?: string;
  social_snapchat?: string;
  social_whatsapp?: string;
  social_telegram?: string;
  social_website?: string;
  logo?: File | null;
  banner?: File | null;
  policy_return_ar?: string;
  policy_return_en?: string;
  policy_shipping_ar?: string;
  policy_shipping_en?: string;
  policy_exchange_ar?: string;
  policy_exchange_en?: string;
  policy_returnWindowDays?: number;
  policy_processingTimeDays?: number;
  lang?: string;
}

export interface UpdateCreatorStorePayoutInfoPayload {
  method?: "BANK_TRANSFER" | "CLIQ" | "WALLET";
  bankName?: string;
  accountHolderName?: string;
  iban?: string;
  accountNumber?: string;
  swiftCode?: string;
  cliqAlias?: string;
  walletProvider?: string;
  walletNumber?: string;
  currency?: Currency;
  lang?: string;
}

export interface UpdateCreatorStorePickupAddressPayload {
  contactName?: string;
  phone?: string;
  countryCode?: string;
  country?: string;
  city?: string;
  town?: string;
  street?: string;
  building?: string;
  additionalInfo?: string;
  lat?: number;
  lng?: number;
  locationName?: string;
  lang?: string;
}

export interface UpdateCreatorStorePayload extends UpdateCreatorStoreProfilePayload {
  handle: string;
  payout_method?: "BANK_TRANSFER" | "CLIQ" | "WALLET";
  payout_bankName?: string;
  payout_accountHolderName?: string;
  payout_iban?: string;
  payout_accountNumber?: string;
  payout_swiftCode?: string;
  payout_cliqAlias?: string;
  payout_walletProvider?: string;
  payout_walletNumber?: string;
  payout_currency?: Currency;

  pickup_contactName?: string;
  pickup_phone?: string;
  pickup_countryCode?: string;
  pickup_country?: string;
  pickup_city?: string;
  pickup_town?: string;
  pickup_street?: string;
  pickup_building?: string;
  pickup_notes?: string;
  pickup_additionalInfo?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  pickup_mapLocationName?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  pickup_locationName?: string;
}

export const updateCreatorStoreProfile = async (
  payload: UpdateCreatorStoreProfilePayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorStore>> = authFetcher,
): Promise<DataResponse<CreatorStore>> => {
  const url = new URL(API_ENDPOINTS.CREATORS.UPDATE_STORE);
  if (payload.lang) {
    url.searchParams.append("lang", payload.lang);
  }

  const hasFiles =
    payload.logo instanceof File || payload.banner instanceof File;

  if (hasFiles) {
    const formData = new FormData();
    const fileFields = ["logo", "banner"];

    Object.entries(payload).forEach(([key, value]) => {
      if (fileFields.includes(key)) return;
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    if (payload.logo instanceof File) {
      formData.append("logo", payload.logo);
    }
    if (payload.banner instanceof File) {
      formData.append("banner", payload.banner);
    }

    return fetcher(url.toString(), {
      method: "PUT",
      body: formData,
    });
  }

  const allowedKeys: (keyof UpdateCreatorStoreProfilePayload)[] = [
    "name_ar",
    "name_en",
    "bio_ar",
    "bio_en",
    "tagline_ar",
    "tagline_en",
    "themeColor",
    "countryCode",
    "phone",
    "email",
    "currency",
    "minOrderAmount",
    "businessType",
    "registrationNumber",
    "taxId",
    "social_instagram",
    "social_facebook",
    "social_tiktok",
    "social_youtube",
    "social_x",
    "social_snapchat",
    "social_whatsapp",
    "social_telegram",
    "social_website",
    "policy_return_ar",
    "policy_return_en",
    "policy_shipping_ar",
    "policy_shipping_en",
    "policy_exchange_ar",
    "policy_exchange_en",
    "policy_returnWindowDays",
    "policy_processingTimeDays",
  ];

  const jsonBody: Partial<
    Record<
      keyof UpdateCreatorStoreProfilePayload,
      string | number | Currency | CreatorStoreBusinessType
    >
  > = {};
  allowedKeys.forEach((key) => {
    const val = payload[key];
    if (val !== undefined && val !== null) {
      jsonBody[key] = val as
        | string
        | number
        | Currency
        | CreatorStoreBusinessType;
    }
  });

  return fetcher(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonBody),
  });
};

export const updateCreatorStorePayoutInfo = async (
  payload: UpdateCreatorStorePayoutInfoPayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorStore>> = authFetcher,
): Promise<DataResponse<CreatorStore>> => {
  const allowedKeys: (keyof UpdateCreatorStorePayoutInfoPayload)[] = [
    "method",
    "bankName",
    "accountHolderName",
    "iban",
    "accountNumber",
    "swiftCode",
    "cliqAlias",
    "walletProvider",
    "walletNumber",
    "currency",
    "lang",
  ];

  const jsonBody: Partial<
    Record<keyof UpdateCreatorStorePayoutInfoPayload, string | Currency>
  > = {};
  allowedKeys.forEach((key) => {
    const val = payload[key];
    if (val !== undefined && val !== null) {
      jsonBody[key] = val;
    }
  });

  const url = new URL(API_ENDPOINTS.CREATORS.UPDATE_PAYOUT_INFO);
  if (payload.lang) {
    url.searchParams.append("lang", payload.lang);
  }

  return fetcher(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonBody),
  });
};

export const updateCreatorStorePickupAddress = async (
  payload: UpdateCreatorStorePickupAddressPayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorStore>> = authFetcher,
): Promise<DataResponse<CreatorStore>> => {
  const allowedKeys: (keyof UpdateCreatorStorePickupAddressPayload)[] = [
    "contactName",
    "phone",
    "countryCode",
    "country",
    "city",
    "town",
    "street",
    "building",
    "additionalInfo",
    "lat",
    "lng",
    "locationName",
    "lang",
  ];

  const jsonBody: Partial<
    Record<keyof UpdateCreatorStorePickupAddressPayload, string | number>
  > = {};
  allowedKeys.forEach((key) => {
    const val = payload[key];
    if (val !== undefined && val !== null) {
      jsonBody[key] = val;
    }
  });

  const url = new URL(API_ENDPOINTS.CREATORS.UPDATE_PICKUP_ADDRESS);
  if (payload.lang) {
    url.searchParams.append("lang", payload.lang);
  }

  return fetcher(url.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonBody),
  });
};

export const updateCreatorStore = async (
  payload: UpdateCreatorStorePayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorStore>> = authFetcher,
): Promise<DataResponse<CreatorStore>> => {
  const profilePayload: UpdateCreatorStoreProfilePayload = {
    name_ar: payload.name_ar,
    name_en: payload.name_en,
    bio_ar: payload.bio_ar,
    bio_en: payload.bio_en,
    tagline_ar: payload.tagline_ar,
    tagline_en: payload.tagline_en,
    themeColor: payload.themeColor,
    countryCode: payload.countryCode,
    phone: payload.phone,
    email: payload.email,
    currency: payload.currency,
    minOrderAmount: payload.minOrderAmount,
    businessType: payload.businessType,
    registrationNumber: payload.registrationNumber,
    taxId: payload.taxId,
    social_instagram: payload.social_instagram,
    social_facebook: payload.social_facebook,
    social_tiktok: payload.social_tiktok,
    social_youtube: payload.social_youtube,
    social_x: payload.social_x,
    social_snapchat: payload.social_snapchat,
    social_whatsapp: payload.social_whatsapp,
    social_telegram: payload.social_telegram,
    social_website: payload.social_website,
    logo: payload.logo,
    banner: payload.banner,
    policy_return_ar: payload.policy_return_ar,
    policy_return_en: payload.policy_return_en,
    policy_shipping_ar: payload.policy_shipping_ar,
    policy_shipping_en: payload.policy_shipping_en,
    policy_exchange_ar: payload.policy_exchange_ar,
    policy_exchange_en: payload.policy_exchange_en,
    policy_returnWindowDays: payload.policy_returnWindowDays,
    policy_processingTimeDays: payload.policy_processingTimeDays,
    lang: payload.lang,
  };

  const payoutPayload: UpdateCreatorStorePayoutInfoPayload = {
    method: payload.payout_method,
    bankName: payload.payout_bankName,
    accountHolderName: payload.payout_accountHolderName,
    iban: payload.payout_iban,
    accountNumber: payload.payout_accountNumber,
    swiftCode: payload.payout_swiftCode,
    cliqAlias: payload.payout_cliqAlias,
    walletProvider: payload.payout_walletProvider,
    walletNumber: payload.payout_walletNumber,
    currency: payload.payout_currency,
    lang: payload.lang,
  };

  const pickupPayload: UpdateCreatorStorePickupAddressPayload = {
    contactName: payload.pickup_contactName,
    phone: payload.pickup_phone,
    countryCode: payload.pickup_countryCode,
    country: payload.pickup_country || "Jordan",
    city: payload.pickup_city,
    town: payload.pickup_town,
    street: payload.pickup_street,
    building: payload.pickup_building,
    additionalInfo: payload.pickup_notes || payload.pickup_additionalInfo,
    lat: payload.pickup_latitude ?? payload.pickup_lat,
    lng: payload.pickup_longitude ?? payload.pickup_lng,
    locationName: payload.pickup_mapLocationName || payload.pickup_locationName,
    lang: payload.lang,
  };

  const [profileRes, payoutRes, pickupRes] = await Promise.all([
    updateCreatorStoreProfile(profilePayload, fetcher),
    updateCreatorStorePayoutInfo(payoutPayload, fetcher),
    updateCreatorStorePickupAddress(pickupPayload, fetcher),
  ]);

  const baseRes = pickupRes?.data
    ? pickupRes
    : payoutRes?.data
      ? payoutRes
      : profileRes;

  return {
    ...baseRes,
    message:
      payload.lang === Locale.AR
        ? "تم حفظ وتحديث جميع بيانات المتجر بنجاح!"
        : "Store data updated successfully!",
  };
};

export const checkHandleAvailability = async ({
  handle,
  lang = Locale.EN,
  fetcher = authFetcher,
  signal,
}: {
  handle: string;
  lang?: string;
  fetcher?: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<HandleAvailabilityData>>;
  signal?: AbortSignal;
}): Promise<DataResponse<HandleAvailabilityData>> => {
  const cleanHandle = encodeURIComponent(handle.toLowerCase().trim());
  const url = new URL(`${API_ENDPOINTS.CREATORS.CHECK_HANDLE}/${cleanHandle}`);
  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString(), {
    method: "GET",
    signal,
  });
};

export const changeCreatorStoreHandle = async (
  payload: ChangeHandlePayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<ChangeHandleData>> = authFetcher,
): Promise<DataResponse<ChangeHandleData>> => {
  return fetcher(API_ENDPOINTS.CREATORS.CHANGE_HANDLE, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      handle: payload.handle.toLowerCase().trim(),
      lang: payload.lang || Locale.EN,
    }),
  });
};

export const fetchPublicCreatorStore = async ({
  handle,
  lang = Locale.EN,
  fetcher,
}: {
  handle: string;
  lang?: string;
  fetcher: (url: string) => Promise<DataResponse<CreatorStore>>;
}): Promise<DataResponse<CreatorStore>> => {
  const cleanHandle = encodeURIComponent(
    handle.replace(/^@/, "").toLowerCase().trim(),
  );
  const url = new URL(`${API_ENDPOINTS.CREATORS.PUBLIC_STORE}/${cleanHandle}`);
  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString());
};

export const submitCreatorStoreForReview = async ({
  lang = Locale.EN,
  fetcher = authFetcher,
}: {
  lang?: string;
  fetcher?: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorStore>>;
} = {}): Promise<DataResponse<CreatorStore>> => {
  const url = new URL(API_ENDPOINTS.CREATORS.SUBMIT_FOR_REVIEW);
  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString(), {
    method: "PUT",
  });
};
