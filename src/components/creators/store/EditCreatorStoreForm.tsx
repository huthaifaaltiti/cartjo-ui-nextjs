"use client";

import React, { memo, useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import ImageUploader from "@/components/shared/ImageUploader";
import CharacterCount from "@/components/shared/CharacterCount";
import { Currency } from "@/enums/currency.enum";
import { CreatorStoreBusinessType } from "@/enums/creators/creatorStoreBusinessType.enum";
import { useCreatorStoreQuery } from "@/hooks/react-query/creators/useCreatorStoreQuery";
import {
  useUpdateCreatorStoreMutation,
  useUpdateCreatorStoreProfileMutation,
  useUpdateCreatorStorePayoutInfoMutation,
  useUpdateCreatorStorePickupAddressMutation,
} from "@/hooks/react-query/creators/useUpdateCreatorStoreMutation";

import { validationConfig } from "@/config/validationConfig";
import { isArabicWithNumAndPunctuationOnly } from "@/utils/text/containsArabic";
import { isEnglishWithNumAndPunctuationOnly } from "@/utils/text/containsEnglish";
import { MEDIA_CONFIG } from "@/config/media.config";
import { isArabicLocale } from "@/config/locales.config";
import { CreatorStore } from "@/types/creators/creatorStore";
import StoreHandleCard from "@/components/creators/store/handle/StoreHandleCard";
import { jordanCities } from "@/constants/jordanCities.constant";
import {
  Store,
  Palette,
  Building2,
  Phone,
  Share2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  ChevronDown,
  ChevronsUpDown,
  Search,
  Landmark,
  MapPin,
  Navigation,
  Save,
  X,
} from "lucide-react";
import {
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaYoutube,
  FaXTwitter,
  FaSnapchat,
  FaWhatsapp,
  FaTelegram,
  FaGlobe,
} from "react-icons/fa6";
import { THEME_COLOR_PRESETS } from "@/config/creatorStoreThemePresets.config";

const LocationPicker = dynamic(
  () => import("@/components/shared/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] rounded-2xl bg-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
        <span className="text-xs font-medium">Loading Map...</span>
      </div>
    ),
  },
);

interface CityComboboxProps {
  value?: string;
  onChange: (value: string) => void;
  isAr: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const CityCombobox: React.FC<CityComboboxProps> = ({
  value,
  onChange,
  isAr,
  placeholder,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCity = jordanCities.find(
    (c) =>
      c.value === value ||
      c.label.en.toLowerCase() === value?.toLowerCase() ||
      c.label.ar === value,
  );

  const displayLabel = selectedCity
    ? isAr
      ? `${selectedCity.label.ar} (${selectedCity.label.en})`
      : `${selectedCity.label.en} (${selectedCity.label.ar})`
    : value || "";

  const filteredCities = jordanCities.filter((city) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      city.label.en.toLowerCase().includes(q) ||
      city.label.ar.includes(q) ||
      city.value.toLowerCase().includes(q)
    );
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white-50 px-3.5 py-2 text-sm text-gray-900 shadow-2xs hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
            <span
              className={
                displayLabel
                  ? "text-gray-900 font-medium truncate"
                  : "text-gray-400"
              }
            >
              {displayLabel ||
                placeholder ||
                (isAr
                  ? "اختر المدينة / المحافظة"
                  : "Select City / Governorate")}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {value && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                  setSearchQuery("");
                }}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                title={isAr ? "مسح الاختيار" : "Clear selection"}
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronsUpDown className="w-4 h-4 text-gray-400 shrink-0" />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[calc(100vw-2.5rem)] sm:w-[360px] p-0 rounded-2xl border border-gray-200 bg-white-50 shadow-xl z-[1002]"
        dir={isAr ? "rtl" : "ltr"}
      >
        <div className="p-2 border-b border-gray-100">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? "ابحث عن مدينة أو محافظة..."
                  : "Search city or governorate..."
              }
              className="w-full bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
          {filteredCities.map((city) => {
            const isSelected =
              selectedCity?.value === city.value ||
              value === city.label.en ||
              value === city.label.ar;

            return (
              <button
                key={city.value}
                type="button"
                onClick={() => {
                  onChange(isAr ? city.label.ar : city.label.en);
                  setOpen(false);
                  setSearchQuery("");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-start ${
                  isSelected
                    ? "bg-purple-50 text-purple-900 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {isAr ? city.label.ar : city.label.en}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {isAr ? city.label.en : city.label.ar}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                )}
              </button>
            );
          })}

          {filteredCities.length === 0 && searchQuery.trim() && (
            <div className="p-3 text-center space-y-2">
              <p className="text-xs text-gray-500">
                {isAr
                  ? "لم يتم العثور على محافظة مطابقة"
                  : "No matching governorate found"}
              </p>
              <button
                type="button"
                onClick={() => {
                  onChange(searchQuery.trim());
                  setOpen(false);
                  setSearchQuery("");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {isAr
                  ? `استخدام "${searchQuery.trim()}" كمدينة`
                  : `Use "${searchQuery.trim()}" as city`}
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const editFormSchema = (
  t: (key: string, values?: Record<string, string | number>) => string,
) => {
  const c = validationConfig.creatorStore;

  return z
    .object({
      name_ar: z
        .string()
        .min(c.nameMinChars, {
          message:
            t("validations.name_arRequired") || "Arabic name is required",
        })
        .max(c.nameMaxChars, {
          message:
            t("validations.name_arMaxChars") || "Arabic name is too long",
        })
        .refine((val) => isArabicWithNumAndPunctuationOnly(val), {
          message:
            t("validations.name_arLang") ||
            "Arabic name must contain Arabic letters only",
        }),
      name_en: z
        .string()
        .min(c.nameMinChars, {
          message:
            t("validations.name_enRequired") || "English name is required",
        })
        .max(c.nameMaxChars, {
          message:
            t("validations.name_enMaxChars") || "English name is too long",
        })
        .refine((val) => isEnglishWithNumAndPunctuationOnly(val), {
          message:
            t("validations.name_enLang") ||
            "English name must contain English letters only",
        }),
      handle: z
        .string()
        .min(c.handleMinChars, {
          message: t("validations.handleRequired") || "Handle is required",
        })
        .max(c.handleMaxChars)
        .regex(c.handlePattern, {
          message:
            t("validations.handleInvalid", {
              min: c.handleMinChars,
              max: c.handleMaxChars,
            }) ||
            `Handle must be ${c.handleMinChars}-${c.handleMaxChars} lowercase letters, numbers, dashes or underscores`,
        }),
      logo: z.string().min(1, {
        message: t("validations.logoRequired") || "Store logo is required",
      }),
      banner: z.string().min(1, {
        message: t("validations.bannerRequired") || "Cover banner is required",
      }),
      bio_ar: z
        .string()
        .max(c.bioMaxChars)
        .refine((val) => !val || isArabicWithNumAndPunctuationOnly(val), {
          message:
            t("validations.bio_arLang") ||
            "Arabic bio must contain Arabic letters only",
        })
        .optional()
        .or(z.literal("")),
      bio_en: z
        .string()
        .max(c.bioMaxChars)
        .refine((val) => !val || isEnglishWithNumAndPunctuationOnly(val), {
          message:
            t("validations.bio_enLang") ||
            "English bio must contain English letters only",
        })
        .optional()
        .or(z.literal("")),
      tagline_ar: z
        .string()
        .max(c.taglineMaxChars)
        .refine((val) => !val || isArabicWithNumAndPunctuationOnly(val), {
          message:
            t("validations.tagline_arLang") ||
            "Arabic tagline must contain Arabic letters only",
        })
        .optional()
        .or(z.literal("")),
      tagline_en: z
        .string()
        .max(c.taglineMaxChars)
        .refine((val) => !val || isEnglishWithNumAndPunctuationOnly(val), {
          message:
            t("validations.tagline_enLang") ||
            "English tagline must contain English letters only",
        })
        .optional()
        .or(z.literal("")),
      themeColor: z
        .string()
        .regex(c.themeColorPattern, {
          message: t("validations.themeColorInvalid") || "Invalid hex color",
        })
        .optional()
        .or(z.literal("")),
      countryCode: z.string().optional().or(z.literal("")),
      phone: z.string().max(c.phoneMaxChars).optional().or(z.literal("")),
      email: z
        .string()
        .email({ message: t("validations.emailInvalid") || "Invalid email" })
        .optional()
        .or(z.literal("")),
      currency: z.nativeEnum(Currency),
      minOrderAmount: z
        .number({ invalid_type_error: "Must be a number" })
        .min(0)
        .max(c.minOrderAmountMax),
      businessType: z.nativeEnum(CreatorStoreBusinessType),
      registrationNumber: z.string().max(120).optional().or(z.literal("")),
      taxId: z.string().max(120).optional().or(z.literal("")),
      social_instagram: z.string().optional().or(z.literal("")),
      social_tiktok: z.string().optional().or(z.literal("")),
      social_facebook: z.string().optional().or(z.literal("")),
      social_youtube: z.string().optional().or(z.literal("")),
      social_x: z.string().optional().or(z.literal("")),
      social_snapchat: z.string().optional().or(z.literal("")),
      social_whatsapp: z.string().optional().or(z.literal("")),
      social_telegram: z.string().optional().or(z.literal("")),
      social_website: z.string().optional().or(z.literal("")),
      payout_bankName: z
        .string()
        .min(2, {
          message:
            t("validations.payoutBankNameRequired") || "Bank name is required",
        })
        .max(120),
      payout_accountHolderName: z
        .string()
        .min(2, {
          message:
            t("validations.payoutAccountHolderNameRequired") ||
            "Account holder name is required",
        })
        .max(120),
      payout_iban: z
        .string()
        .min(15, {
          message:
            t("validations.payoutIbanRequired") || "IBAN number is required",
        })
        .max(35)
        .refine(
          (val) => {
            const clean = val.replace(/\s+/g, "").toUpperCase();
            return /^[A-Z]{2}[0-9A-Z]{13,32}$/.test(clean);
          },
          {
            message:
              t("validations.payoutIbanInvalid") ||
              "Please enter a valid IBAN (e.g. JO...)",
          },
        ),
      payout_accountNumber: z
        .string()
        .min(4, {
          message:
            t("validations.payoutAccountNumberRequired") ||
            "Account number is required",
        })
        .max(50),
      payout_cliqAlias: z.string().max(100).optional().or(z.literal("")),
      payout_currency: z.nativeEnum(Currency).optional(),
      pickup_country: z
        .string()
        .min(2, {
          message:
            t("validations.pickupCountryRequired") || "Country is required",
        })
        .max(100),
      pickup_city: z
        .string()
        .min(2, {
          message: t("validations.pickupCityRequired") || "City is required",
        })
        .max(100),
      pickup_street: z
        .string()
        .min(2, {
          message:
            t("validations.pickupStreetRequired") ||
            "Street address is required",
        })
        .max(200),
      pickup_building: z
        .string()
        .min(1, {
          message:
            t("validations.pickupBuildingRequired") ||
            "Building details are required",
        })
        .max(100),
      pickup_notes: z.string().max(500).optional().or(z.literal("")),
      pickup_latitude: z.number().optional(),
      pickup_longitude: z.number().optional(),
      pickup_mapLocationName: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.businessType === CreatorStoreBusinessType.COMPANY) {
        if (!data.registrationNumber || !data.registrationNumber.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["registrationNumber"],
            message:
              t("validations.registrationNumberRequired") ||
              "Commercial Registration Number is required for registered companies.",
          });
        }
        if (!data.taxId || !data.taxId.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["taxId"],
            message:
              t("validations.taxIdRequired") ||
              "Tax Identification Number (TIN) is required for registered companies.",
          });
        }
      }
    });
};

type FormValues = z.infer<ReturnType<typeof editFormSchema>>;

interface EditCreatorStoreFormProps {
  initialStore?: CreatorStore | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditCreatorStoreForm: React.FC<EditCreatorStoreFormProps> = ({
  initialStore,
  onSuccess,
  onCancel,
}) => {
  const t = useTranslations(
    "routes.creators.dashboard.routes.store.routes.edit.form",
  );
  const tc = useTranslations(
    "routes.creators.dashboard.routes.store.routes.create.form",
  );
  const tg = useTranslations("general");
  const locale = useLocale();
  const router = useRouter();
  const isAr = isArabicLocale(locale);
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const { data: storeData } = useCreatorStoreQuery();

  const store = initialStore || storeData?.data;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(store?.logo?.url || "");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>(store?.banner?.url || "");

  const initialLat =
    store?.pickupAddress?.latitude ??
    store?.pickupAddress?.location?.lat ??
    store?.pickupAddress?.mapLocation?.lat;
  const initialLng =
    store?.pickupAddress?.longitude ??
    store?.pickupAddress?.location?.lng ??
    store?.pickupAddress?.mapLocation?.lng;

  const [mapPosition, setMapPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null,
  );
  const [locationName, setLocationName] = useState<string>(
    store?.pickupAddress?.location?.name ||
      store?.pickupAddress?.mapLocation?.name ||
      "",
  );

  const profileMutation = useUpdateCreatorStoreProfileMutation();
  const payoutMutation = useUpdateCreatorStorePayoutInfoMutation();
  const pickupMutation = useUpdateCreatorStorePickupAddressMutation();
  const updateMutation = useUpdateCreatorStoreMutation();

  const formSchema = editFormSchema(tc);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_ar: store?.name?.ar || "",
      name_en: store?.name?.en || "",
      handle: store?.handle || "",
      logo: store?.logo?.url || "",
      banner: store?.banner?.url || "",
      bio_ar: store?.bio?.ar || "",
      bio_en: store?.bio?.en || "",
      tagline_ar: store?.tagline?.ar || "",
      tagline_en: store?.tagline?.en || "",
      themeColor: store?.themeColor || "#7c3aed",
      countryCode: store?.countryCode || "962",
      phone: store?.phone || "",
      email: store?.email || "",
      currency: store?.currency || Currency.JOD,
      minOrderAmount: store?.minOrderAmount ?? 0,
      businessType: store?.businessType || CreatorStoreBusinessType.INDIVIDUAL,
      registrationNumber: store?.registrationNumber || "",
      taxId: store?.taxId || "",
      social_instagram: store?.socialLinks?.instagram || "",
      social_tiktok: store?.socialLinks?.tiktok || "",
      social_facebook: store?.socialLinks?.facebook || "",
      social_youtube: store?.socialLinks?.youtube || "",
      social_x: store?.socialLinks?.x || "",
      social_snapchat: store?.socialLinks?.snapchat || "",
      social_whatsapp: store?.socialLinks?.whatsapp || "",
      social_telegram: store?.socialLinks?.telegram || "",
      social_website: store?.socialLinks?.website || "",
      payout_bankName: store?.payoutInfo?.bankName || "",
      payout_accountHolderName: store?.payoutInfo?.accountHolderName || "",
      payout_iban: store?.payoutInfo?.iban || "",
      payout_accountNumber: store?.payoutInfo?.accountNumber || "",
      payout_cliqAlias: store?.payoutInfo?.cliqAlias || "",
      payout_currency:
        (store?.payoutInfo?.currency as Currency) || Currency.JOD,
      pickup_country: store?.pickupAddress?.country || "Jordan",
      pickup_city: store?.pickupAddress?.city || "",
      pickup_street: store?.pickupAddress?.street || "",
      pickup_building: store?.pickupAddress?.building || "",
      pickup_notes:
        store?.pickupAddress?.notes ||
        store?.pickupAddress?.additionalInfo ||
        "",
      pickup_latitude: initialLat ?? undefined,
      pickup_longitude: initialLng ?? undefined,
      pickup_mapLocationName:
        store?.pickupAddress?.location?.name ||
        store?.pickupAddress?.mapLocation?.name ||
        "",
    },
  });

  useEffect(() => {
    if (store) {
      const lat =
        store.pickupAddress?.latitude ??
        store.pickupAddress?.location?.lat ??
        store.pickupAddress?.mapLocation?.lat ??
        undefined;
      const lng =
        store.pickupAddress?.longitude ??
        store.pickupAddress?.location?.lng ??
        store.pickupAddress?.mapLocation?.lng ??
        undefined;

      const locName =
        store.pickupAddress?.location?.name ||
        store.pickupAddress?.mapLocation?.name ||
        "";

      form.reset({
        name_ar: store.name?.ar || "",
        name_en: store.name?.en || "",
        handle: store.handle || "",
        logo: store.logo?.url || "",
        banner: store.banner?.url || "",
        bio_ar: store.bio?.ar || "",
        bio_en: store.bio?.en || "",
        tagline_ar: store.tagline?.ar || "",
        tagline_en: store.tagline?.en || "",
        themeColor: store.themeColor || "#7c3aed",
        countryCode: store.countryCode || "962",
        phone: store.phone || "",
        email: store.email || "",
        currency: store.currency || Currency.JOD,
        minOrderAmount: store.minOrderAmount ?? 0,
        businessType: store.businessType || CreatorStoreBusinessType.INDIVIDUAL,
        registrationNumber: store.registrationNumber || "",
        taxId: store.taxId || "",
        social_instagram: store.socialLinks?.instagram || "",
        social_tiktok: store.socialLinks?.tiktok || "",
        social_facebook: store.socialLinks?.facebook || "",
        social_youtube: store.socialLinks?.youtube || "",
        social_x: store.socialLinks?.x || "",
        social_snapchat: store.socialLinks?.snapchat || "",
        social_whatsapp: store.socialLinks?.whatsapp || "",
        social_telegram: store.socialLinks?.telegram || "",
        social_website: store.socialLinks?.website || "",
        payout_bankName: store.payoutInfo?.bankName || "",
        payout_accountHolderName: store.payoutInfo?.accountHolderName || "",
        payout_iban: store.payoutInfo?.iban || "",
        payout_accountNumber: store.payoutInfo?.accountNumber || "",
        payout_cliqAlias: store.payoutInfo?.cliqAlias || "",
        payout_currency:
          (store.payoutInfo?.currency as Currency) || Currency.JOD,
        pickup_country: store.pickupAddress?.country || "Jordan",
        pickup_city: store.pickupAddress?.city || "",
        pickup_street: store.pickupAddress?.street || "",
        pickup_building: store.pickupAddress?.building || "",
        pickup_notes:
          store.pickupAddress?.notes ||
          store.pickupAddress?.additionalInfo ||
          "",
        pickup_latitude: lat,
        pickup_longitude: lng,
        pickup_mapLocationName: locName,
      });
      setLogoUrl(store.logo?.url || "");
      setBannerUrl(store.banner?.url || "");
      setLogoFile(null);
      setBannerFile(null);
      if (lat && lng) {
        setMapPosition({ lat, lng });
      }
      setLocationName(locName);
    }
  }, [store, form]);

  const handleLocationChange = (coords: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    setMapPosition({ lat: coords.lat, lng: coords.lng });
    setLocationName(coords.name || "");
    form.setValue("pickup_latitude", coords.lat, { shouldValidate: true });
    form.setValue("pickup_longitude", coords.lng, { shouldValidate: true });
    form.setValue("pickup_mapLocationName", coords.name || "");

    // If city is not filled, try to infer from jordanCities or coords.name
    if (!form.getValues("pickup_city") && coords.name) {
      const matchedCity = jordanCities.find(
        (c) =>
          coords.name.toLowerCase().includes(c.label.en.toLowerCase()) ||
          coords.name.includes(c.label.ar),
      );
      if (matchedCity) {
        form.setValue(
          "pickup_city",
          isAr ? matchedCity.label.ar : matchedCity.label.en,
          { shouldValidate: true },
        );
      }
    }
  };

  const selectedBusinessType = form.watch("businessType");
  const selectedThemeColor = form.watch("themeColor") || "#7c3aed";
  const watchHandle = form.watch("handle") || "";

  const handleSaveProfile = async () => {
    const profileFields: (keyof FormValues)[] = [
      "name_ar",
      "name_en",
      "logo",
      "banner",
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
      "social_tiktok",
      "social_facebook",
      "social_youtube",
      "social_x",
      "social_snapchat",
      "social_whatsapp",
      "social_telegram",
      "social_website",
    ];

    const isValid = await form.trigger(profileFields);
    if (!isValid) return;

    const values = form.getValues();
    await profileMutation.mutateAsync({
      name_ar: values.name_ar.trim(),
      name_en: values.name_en.trim(),
      bio_ar: values.bio_ar?.trim() || undefined,
      bio_en: values.bio_en?.trim() || undefined,
      tagline_ar: values.tagline_ar?.trim() || undefined,
      tagline_en: values.tagline_en?.trim() || undefined,
      themeColor: values.themeColor?.trim() || undefined,
      countryCode: values.countryCode?.trim() || undefined,
      phone: values.phone?.trim() || undefined,
      email: values.email?.trim() || undefined,
      currency: values.currency,
      minOrderAmount: values.minOrderAmount,
      businessType: values.businessType,
      registrationNumber: values.registrationNumber?.trim() || undefined,
      taxId: values.taxId?.trim() || undefined,
      social_instagram: values.social_instagram?.trim() ?? "",
      social_tiktok: values.social_tiktok?.trim() ?? "",
      social_facebook: values.social_facebook?.trim() ?? "",
      social_youtube: values.social_youtube?.trim() ?? "",
      social_x: values.social_x?.trim() ?? "",
      social_snapchat: values.social_snapchat?.trim() ?? "",
      social_whatsapp: values.social_whatsapp?.trim() ?? "",
      social_telegram: values.social_telegram?.trim() ?? "",
      social_website: values.social_website?.trim() ?? "",
      logo: logoFile,
      banner: bannerFile,
      lang: locale,
    });
  };

  const handleSavePayout = async () => {
    const payoutFields: (keyof FormValues)[] = [
      "payout_bankName",
      "payout_accountHolderName",
      "payout_iban",
      "payout_accountNumber",
      "payout_cliqAlias",
      "payout_currency",
    ];

    const isValid = await form.trigger(payoutFields);
    if (!isValid) return;

    const values = form.getValues();
    await payoutMutation.mutateAsync({
      bankName: values.payout_bankName.trim(),
      accountHolderName: values.payout_accountHolderName.trim(),
      iban: values.payout_iban.trim(),
      accountNumber: values.payout_accountNumber.trim(),
      cliqAlias: values.payout_cliqAlias?.trim() || undefined,
      currency: values.payout_currency || Currency.JOD,
      lang: locale,
    });
  };

  const handleSavePickup = async () => {
    const pickupFields: (keyof FormValues)[] = [
      "pickup_country",
      "pickup_city",
      "pickup_street",
      "pickup_building",
      "pickup_notes",
    ];

    const isValid = await form.trigger(pickupFields);
    if (!isValid) return;

    const values = form.getValues();
    await pickupMutation.mutateAsync({
      country: values.pickup_country.trim(),
      city: values.pickup_city.trim(),
      street: values.pickup_street.trim(),
      building: values.pickup_building.trim(),
      additionalInfo: values.pickup_notes?.trim() || undefined,
      lat: values.pickup_latitude,
      lng: values.pickup_longitude,
      locationName: values.pickup_mapLocationName?.trim() || undefined,
      lang: locale,
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await updateMutation.mutateAsync(
      {
        name_ar: values.name_ar.trim(),
        name_en: values.name_en.trim(),
        handle: values.handle.toLowerCase().trim(),
        bio_ar: values.bio_ar?.trim() || undefined,
        bio_en: values.bio_en?.trim() || undefined,
        tagline_ar: values.tagline_ar?.trim() || undefined,
        tagline_en: values.tagline_en?.trim() || undefined,
        themeColor: values.themeColor?.trim() || undefined,
        countryCode: values.countryCode?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        email: values.email?.trim() || undefined,
        currency: values.currency,
        minOrderAmount: values.minOrderAmount,
        businessType: values.businessType,
        registrationNumber: values.registrationNumber?.trim() || undefined,
        taxId: values.taxId?.trim() || undefined,
        social_instagram: values.social_instagram?.trim() ?? "",
        social_tiktok: values.social_tiktok?.trim() ?? "",
        social_facebook: values.social_facebook?.trim() ?? "",
        social_youtube: values.social_youtube?.trim() ?? "",
        social_x: values.social_x?.trim() ?? "",
        social_snapchat: values.social_snapchat?.trim() ?? "",
        social_whatsapp: values.social_whatsapp?.trim() ?? "",
        social_telegram: values.social_telegram?.trim() ?? "",
        social_website: values.social_website?.trim() ?? "",
        logo: logoFile,
        banner: bannerFile,
        payout_bankName: values.payout_bankName.trim(),
        payout_accountHolderName: values.payout_accountHolderName.trim(),
        payout_iban: values.payout_iban.trim(),
        payout_accountNumber: values.payout_accountNumber.trim(),
        payout_cliqAlias: values.payout_cliqAlias?.trim() || undefined,
        payout_currency: values.payout_currency || Currency.JOD,
        pickup_country: values.pickup_country.trim(),
        pickup_city: values.pickup_city.trim(),
        pickup_street: values.pickup_street.trim(),
        pickup_building: values.pickup_building.trim(),
        pickup_notes: values.pickup_notes?.trim() || undefined,
        pickup_latitude: values.pickup_latitude,
        pickup_longitude: values.pickup_longitude,
        pickup_mapLocationName:
          values.pickup_mapLocationName?.trim() || undefined,
        lang: locale,
      },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            router.push(`/${locale}/creators/dashboard/store`);
            router.refresh();
          }
        },
      },
    );
  };

  return (
    <div className="w-full space-y-8 pb-8" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner with Live Preview */}
      <div
        className="rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 p-6 sm:p-8 text-white-50 shadow-sm relative overflow-hidden transition-all duration-300 bg-cover bg-center"
        style={
          bannerUrl
            ? { backgroundImage: `url("${bannerUrl.replace(/"/g, '\\"')}")` }
            : undefined
        }
      >
        {bannerUrl ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] pointer-events-none transition-opacity duration-300" />
        ) : (
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white-50/10 blur-2xl pointer-events-none" />
        )}

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          {logoUrl && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-white-50/40 shadow-md shrink-0 bg-white-50/10 backdrop-blur-md">
              <Image
                src={logoUrl}
                alt="Store Logo Preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white-50/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t("badge") || "Manage Store"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t("title") || "Edit Creator Store"}
            </h1>
            <p className="text-sm text-purple-100 mt-1 max-w-xl">
              {t("subtitle") ||
                "Update your storefront branding, identity, and contact details."}
            </p>
          </div>
        </div>
      </div>

      {/* Change Store Handle Section */}
      {store && <StoreHandleCard store={store} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Visual Branding & Media */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {tc("sections.branding")}
                </h2>
                <p className="text-xs text-gray-500">
                  {tc("sections.brandingDesc")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Logo */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.logo")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      {tc("fields.logoHint")}
                    </FormDescription>
                    <FormControl>
                      <div className="pt-2">
                        <ImageUploader
                          value={logoUrl}
                          variant="rounded"
                          size="lg"
                          maxSizeInMB={MEDIA_CONFIG.CREATOR_STORE.LOGO.MAX_SIZE}
                          onChange={({ file, url }) => {
                            const newUrl = url ?? "";
                            setLogoFile(file ?? null);
                            setLogoUrl(newUrl);
                            field.onChange(newUrl);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Store Banner */}
              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.banner")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      {tc("fields.bannerHint")}
                    </FormDescription>
                    <FormControl>
                      <div className="pt-2">
                        <ImageUploader
                          value={bannerUrl}
                          variant="rounded"
                          size="xl"
                          maxSizeInMB={
                            MEDIA_CONFIG.CREATOR_STORE.BANNER.MAX_SIZE
                          }
                          onChange={({ file, url }) => {
                            const newUrl = url ?? "";
                            setBannerFile(file ?? null);
                            setBannerUrl(newUrl);
                            field.onChange(newUrl);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Theme Color Picker */}
            <FormField
              control={form.control}
              name="themeColor"
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormLabel className="text-sm font-semibold text-gray-800">
                    {tc("fields.themeColor")}
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-500">
                    {tc("fields.themeColorHint")}
                  </FormDescription>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {THEME_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => form.setValue("themeColor", preset.hex)}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium transition-all hover:border-gray-400"
                        style={{
                          borderColor:
                            selectedThemeColor === preset.hex
                              ? preset.hex
                              : undefined,
                          backgroundColor:
                            selectedThemeColor === preset.hex
                              ? `${preset.hex}15`
                              : undefined,
                        }}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: preset.hex }}
                        >
                          {selectedThemeColor === preset.hex && (
                            <Check className="w-2.5 h-2.5 text-white-50" />
                          )}
                        </span>
                        <span>{isAr ? preset.name.ar : preset.name.en}</span>
                      </button>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={field.value || "#7c3aed"}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                      />
                      <Input
                        {...field}
                        placeholder="#7c3aed"
                        className="w-28 font-mono text-xs"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 2: Store Identity & Information */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {tc("sections.identity")}
                </h2>
                <p className="text-xs text-gray-500">
                  {tc("sections.identityDesc")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name AR */}
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.nameAr")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.nameArPlaceholder")}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name EN */}
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.nameEn")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.nameEnPlaceholder")}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Handle */}
            <FormField
              control={form.control}
              name="handle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800">
                    {tc("fields.handle")}{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span
                        className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-mono text-sm rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5"
                        aria-hidden="true"
                      >
                        @
                      </span>
                      <Input
                        {...field}
                        placeholder={tc("fields.handlePlaceholder")}
                        className="pl-8 rtl:pl-3 rtl:pr-8 font-mono lowercase"
                        dir="ltr"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    {tc("fields.handleHint")}
                    <span className="font-semibold text-purple-700">
                      {watchHandle || "your-handle"}
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Taglines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tagline_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.taglineAr")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.taglineArPlaceholder")}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagline_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.taglineEn")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.taglineEnPlaceholder")}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bio_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.bioAr")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        maxLength={validationConfig.creatorStore.bioMaxChars}
                        placeholder={tc("fields.bioArPlaceholder")}
                        dir="rtl"
                      />
                    </FormControl>
                    <CharacterCount
                      value={field.value}
                      max={validationConfig.creatorStore.bioMaxChars}
                      min={validationConfig.creatorStore.bioMinChars}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.bioEn")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        maxLength={validationConfig.creatorStore.bioMaxChars}
                        placeholder={tc("fields.bioEnPlaceholder")}
                        dir="ltr"
                      />
                    </FormControl>
                    <CharacterCount
                      value={field.value}
                      max={validationConfig.creatorStore.bioMaxChars}
                      min={validationConfig.creatorStore.bioMinChars}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 3: Business & Commercial Settings */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {tc("sections.business")}
                </h2>
                <p className="text-xs text-gray-500">
                  {tc("sections.businessDesc")}
                </p>
              </div>
            </div>

            {/* Business Type */}
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800">
                    {tc("fields.businessType")}
                  </FormLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label
                      className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-all ${
                        field.value === CreatorStoreBusinessType.INDIVIDUAL
                          ? "border-purple-600 bg-purple-50/50 shadow-xs"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={CreatorStoreBusinessType.INDIVIDUAL}
                        checked={
                          field.value === CreatorStoreBusinessType.INDIVIDUAL
                        }
                        onChange={() =>
                          field.onChange(CreatorStoreBusinessType.INDIVIDUAL)
                        }
                        className="accent-purple-600"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {tc("fields.individual")}
                        </p>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer rounded-xl border p-4 flex items-center gap-3 transition-all ${
                        field.value === CreatorStoreBusinessType.COMPANY
                          ? "border-purple-600 bg-purple-50/50 shadow-xs"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={CreatorStoreBusinessType.COMPANY}
                        checked={
                          field.value === CreatorStoreBusinessType.COMPANY
                        }
                        onChange={() =>
                          field.onChange(CreatorStoreBusinessType.COMPANY)
                        }
                        className="accent-purple-600"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {tc("fields.company")}
                        </p>
                      </div>
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Registration & Tax IDs (if Company) */}
            {selectedBusinessType === CreatorStoreBusinessType.COMPANY && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-800">
                        {tc("fields.registrationNumber")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={tc(
                            "fields.registrationNumberPlaceholder",
                          )}
                          dir={isAr ? "rtl" : "ltr"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-800">
                        {tc("fields.taxId")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={tc("fields.taxIdPlaceholder")}
                          dir={isAr ? "rtl" : "ltr"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Currency & Min Order Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.currency")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          value={field.value || Currency.JOD}
                          onChange={(e) =>
                            field.onChange(e.target.value as Currency)
                          }
                          className="flex h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white-50 px-3.5 py-2 text-sm text-gray-800 shadow-2xs transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value={Currency.JOD}>
                            JOD - Jordanian Dinar (دينار أردني)
                          </option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-auto rtl:left-3.5" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minOrderAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.minOrderAmount")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value) || 0)
                        }
                        placeholder={tc("fields.minOrderAmountPlaceholder")}
                        dir={isAr ? "rtl" : "ltr"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 4: Contact Details */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {tc("sections.contact")}
                </h2>
                <p className="text-xs text-gray-500">
                  {tc("sections.contactDesc")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Country Code */}
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.countryCode")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="962" dir="ltr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.phone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.phonePlaceholder")}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-800">
                    {tc("fields.email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder={tc("fields.emailPlaceholder")}
                      dir="ltr"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 5: Social Media Links */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {tc("sections.social")}
                </h2>
                <p className="text-xs text-gray-500">
                  {tc("sections.socialDesc")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Instagram */}
              <FormField
                control={form.control}
                name="social_instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaInstagram className="w-3.5 h-3.5 text-pink-600" />
                      {tc("fields.social_instagram")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="username or URL"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* TikTok */}
              <FormField
                control={form.control}
                name="social_tiktok"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaTiktok className="w-3.5 h-3.5 text-black" />
                      {tc("fields.social_tiktok")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="@handle or URL"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Facebook */}
              <FormField
                control={form.control}
                name="social_facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaFacebook className="w-3.5 h-3.5 text-blue-600" />
                      {tc("fields.social_facebook")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Profile URL"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* YouTube */}
              <FormField
                control={form.control}
                name="social_youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaYoutube className="w-3.5 h-3.5 text-red-600" />
                      {tc("fields.social_youtube")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Channel URL or @handle"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* X */}
              <FormField
                control={form.control}
                name="social_x"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaXTwitter className="w-3.5 h-3.5 text-black" />
                      {tc("fields.social_x")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="@handle"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* WhatsApp */}
              <FormField
                control={form.control}
                name="social_whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaWhatsapp className="w-3.5 h-3.5 text-green-600" />
                      {tc("fields.social_whatsapp")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Phone e.g. 96279xxxxxxxx"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Telegram */}
              <FormField
                control={form.control}
                name="social_telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaTelegram className="w-3.5 h-3.5 text-sky-500" />
                      {tc("fields.social_telegram")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="@username"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Snapchat */}
              <FormField
                control={form.control}
                name="social_snapchat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaSnapchat className="w-3.5 h-3.5 text-amber-500" />
                      {tc("fields.social_snapchat")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="username"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="social_website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <FaGlobe className="w-3.5 h-3.5 text-primary-600" />
                      {tc("fields.social_website")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://example.com"
                        className="text-xs"
                        dir="ltr"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Save General Store Profile Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {tc("sections.profileSaveHint")}
              </p>
              <Button
                type="button"
                onClick={handleSaveProfile}
                disabled={profileMutation.isPending || updateMutation.isPending}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white-50 px-4 text-xs font-semibold h-10 shadow-xs transition-all gap-2 shrink-0 cursor-pointer"
              >
                {profileMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{tg("loadingStates.saving") || "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{tc("actions.saveProfile")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Section 6: Payout & Banking Details */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {tc("sections.payout")}{" "}
                  <span className="text-red-500">*</span>
                </h2>
                <p className="text-xs text-gray-500">
                  {tc("sections.payoutDesc")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Name */}
              <FormField
                control={form.control}
                name="payout_bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.payout_bankName")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.payout_bankNamePlaceholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Holder Name */}
              <FormField
                control={form.control}
                name="payout_accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.payout_accountHolderName")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc(
                          "fields.payout_accountHolderNamePlaceholder",
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IBAN */}
              <FormField
                control={form.control}
                name="payout_iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.payout_iban")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.payout_ibanPlaceholder")}
                        className="font-mono text-sm uppercase"
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Number */}
              <FormField
                control={form.control}
                name="payout_accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.payout_accountNumber")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc(
                          "fields.payout_accountNumberPlaceholder",
                        )}
                        className="font-mono text-sm"
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CliQ Alias (Optional) */}
              <FormField
                control={form.control}
                name="payout_cliqAlias"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-semibold text-gray-800">
                        {tc("fields.payout_cliqAlias")}
                      </FormLabel>
                      <span className="text-[11px] font-medium text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/60">
                        {isAr ? "اختياري" : "Optional"}
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.payout_cliqAliasPlaceholder")}
                        className="font-mono text-sm"
                        dir="ltr"
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      {tc("fields.payout_cliqAliasHint")}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payout Currency (Disabled - Fixed to JOD) */}
              <FormField
                control={form.control}
                name="payout_currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.payout_currency") || "Currency"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <select
                          {...field}
                          disabled
                          value={field.value || Currency.JOD}
                          className="flex h-10 w-full appearance-none rounded-xl border border-gray-200 bg-gray-100/80 px-3.5 py-2 text-sm text-gray-600 shadow-2xs cursor-not-allowed"
                        >
                          <option value={Currency.JOD}>
                            {isAr
                              ? "JOD - دينار أردني (افتراضي)"
                              : "JOD - Jordanian Dinar (Default)"}
                          </option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 rtl:right-auto rtl:left-3.5" />
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      {tc("fields.payout_currencyHint")}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Save Payout Details Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {tc("sections.payoutSaveHint")}
              </p>
              <Button
                type="button"
                onClick={handleSavePayout}
                disabled={payoutMutation.isPending || updateMutation.isPending}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white-50 px-4 text-xs font-semibold h-10 shadow-xs transition-all gap-2 shrink-0 cursor-pointer"
              >
                {payoutMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{tg("loadingStates.saving") || "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <Landmark className="w-3.5 h-3.5" />
                    <span>{tc("actions.savePayout")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Section 7: Shipping Pickup Address */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {tc("sections.pickup")}{" "}
                  <span className="text-red-500">*</span>
                </h2>
                <p className="text-xs text-gray-500">
                  {tc("sections.pickupDesc")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country */}
              <FormField
                control={form.control}
                name="pickup_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.pickup_country")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Jordan" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City Searchable Combobox List */}
              <FormField
                control={form.control}
                name="pickup_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.pickup_city")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <CityCombobox
                        value={field.value}
                        onChange={field.onChange}
                        isAr={isAr}
                        placeholder={tc("fields.pickup_cityPlaceholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Street Address */}
              <FormField
                control={form.control}
                name="pickup_street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.pickup_street")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.pickup_streetPlaceholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Building */}
              <FormField
                control={form.control}
                name="pickup_building"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.pickup_building")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={tc("fields.pickup_buildingPlaceholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="pickup_notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-semibold text-gray-800">
                      {tc("fields.pickup_notes")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder={tc("fields.pickup_notesPlaceholder")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Picker on Map */}
              <div className="md:col-span-2 space-y-3 pt-2">
                <div>
                  <FormLabel className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-purple-600" />
                    <span>{tc("fields.pickup_location")}</span>
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-500 mt-0.5">
                    {tc("fields.pickup_locationHint")}
                  </FormDescription>
                </div>

                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
                  <LocationPicker
                    defaultPosition={mapPosition}
                    onChange={handleLocationChange}
                  />
                </div>

                {mapPosition && (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold">
                          {tc("fields.selectedLocation")}:
                        </span>{" "}
                        {locationName ? <span>{locationName} </span> : null}
                        <span
                          className="font-mono text-purple-700 font-medium"
                          dir="ltr"
                        >
                          ({mapPosition.lat.toFixed(4)},{" "}
                          {mapPosition.lng.toFixed(4)})
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMapPosition(null);
                        setLocationName("");
                        form.setValue("pickup_latitude", undefined);
                        form.setValue("pickup_longitude", undefined);
                        form.setValue("pickup_mapLocationName", undefined);
                      }}
                      className="p-1 rounded-lg hover:bg-purple-200/60 text-purple-700 transition-colors shrink-0"
                      title="Clear location"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save Pickup Address Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                {tc("sections.pickupSaveHint")}
              </p>
              <Button
                type="button"
                onClick={handleSavePickup}
                disabled={pickupMutation.isPending || updateMutation.isPending}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white-50 px-4 text-xs font-semibold h-10 shadow-xs transition-all gap-2 shrink-0 cursor-pointer"
              >
                {pickupMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{tg("loadingStates.saving") || "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tc("actions.savePickup")}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Submit & Cancel Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={
                onCancel ||
                (() => router.push(`/${locale}/creators/dashboard/store`))
              }
              disabled={updateMutation.isPending}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              {tc("cancelBtn")}
            </button>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white-50 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{tg("loadingStates.saving") || "Saving..."}</span>
                </>
              ) : (
                <>
                  <span>
                    {tc("actions.saveAll") ||
                      t("saveBtn") ||
                      "Save All Changes"}
                  </span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default memo(EditCreatorStoreForm);
