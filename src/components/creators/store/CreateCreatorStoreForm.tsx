"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
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
import ImageUploader from "@/components/shared/ImageUploader";
import CharacterCount from "@/components/shared/CharacterCount";
import { Currency } from "@/enums/currency.enum";
import { CreatorStoreBusinessType } from "@/enums/creators/creatorStoreBusinessType.enum";
import { HandleAvailabilityReason } from "@/enums/creators/handleAvailabilityReason.enum";
import { useCreateCreatorStoreMutation } from "@/hooks/react-query/creators/useCreateCreatorStoreMutation";
import { useHandleAvailabilityQuery } from "@/hooks/react-query/creators/useHandleAvailabilityQuery";
import HandleAvailabilityStatus from "./handle/HandleAvailabilityStatus";
import { validationConfig } from "@/config/validationConfig";
import { isArabicWithNumAndPunctuationOnly } from "@/utils/text/containsArabic";
import { isEnglishWithNumAndPunctuationOnly } from "@/utils/text/containsEnglish";
import { MEDIA_CONFIG } from "@/config/media.config";
import { isArabicLocale } from "@/config/locales.config";
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
import RequiredStar from "@/components/shared/RequiredStar";

const createFormSchema = (
  t: (key: string, values?: Record<string, string | number>) => string,
) => {
  const c = validationConfig.creatorStore;

  return z
    .object({
      name_ar: z
        .string()
        .min(c.nameMinChars, {
          message: t("validations.name_arRequired"),
        })
        .max(c.nameMaxChars, {
          message: t("validations.name_arMaxChars"),
        })
        .refine((val) => isArabicWithNumAndPunctuationOnly(val), {
          message: t("validations.name_arLang"),
        }),
      name_en: z
        .string()
        .min(c.nameMinChars, {
          message: t("validations.name_enRequired"),
        })
        .max(c.nameMaxChars, {
          message: t("validations.name_enMaxChars"),
        })
        .refine((val) => isEnglishWithNumAndPunctuationOnly(val), {
          message: t("validations.name_enLang"),
        }),
      handle: z
        .string()
        .min(c.handleMinChars, {
          message: t("validations.handleRequired"),
        })
        .max(c.handleMaxChars)
        .regex(c.handlePattern, {
          message: t("validations.handleInvalid", {
            min: c.handleMinChars,
            max: c.handleMaxChars,
          }),
        }),
      logo: z.string().min(1, {
        message: t("validations.logoRequired"),
      }),
      banner: z.string().min(1, {
        message: t("validations.bannerRequired"),
      }),
      bio_ar: z
        .string()
        .max(c.bioMaxChars)
        .refine((val) => !val || isArabicWithNumAndPunctuationOnly(val), {
          message: t("validations.bio_arLang"),
        })
        .optional()
        .or(z.literal("")),
      bio_en: z
        .string()
        .max(c.bioMaxChars)
        .refine((val) => !val || isEnglishWithNumAndPunctuationOnly(val), {
          message: t("validations.bio_enLang"),
        })
        .optional()
        .or(z.literal("")),
      tagline_ar: z
        .string()
        .max(c.taglineMaxChars)
        .refine((val) => !val || isArabicWithNumAndPunctuationOnly(val), {
          message: t("validations.tagline_arLang"),
        })
        .optional()
        .or(z.literal("")),
      tagline_en: z
        .string()
        .max(c.taglineMaxChars)
        .refine((val) => !val || isEnglishWithNumAndPunctuationOnly(val), {
          message: t("validations.tagline_enLang"),
        })
        .optional()
        .or(z.literal("")),
      themeColor: z
        .string()
        .regex(c.themeColorPattern, {
          message: t("validations.themeColorInvalid"),
        })
        .optional()
        .or(z.literal("")),
      countryCode: z.string().optional().or(z.literal("")),
      phone: z.string().max(c.phoneMaxChars).optional().or(z.literal("")),
      email: z
        .string()
        .email({ message: t("validations.emailInvalid") })
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
    })
    .superRefine((data, ctx) => {
      if (data.businessType === CreatorStoreBusinessType.COMPANY) {
        if (!data.registrationNumber || !data.registrationNumber.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["registrationNumber"],
            message: t("validations.registrationNumberRequired"),
          });
        }
        if (!data.taxId || !data.taxId.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["taxId"],
            message: t("validations.taxIdRequired"),
          });
        }
      }
    });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface CreateCreatorStoreFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateCreatorStoreForm: React.FC<CreateCreatorStoreFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const t = useTranslations(
    "routes.creators.routes.dashboard.routes.store.routes.create.form",
  );
  const tg = useTranslations("general");
  const locale = useLocale();
  const router = useRouter();
  const isAr = isArabicLocale(locale);
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");

  const createMutation = useCreateCreatorStoreMutation();

  const formSchema = createFormSchema(t);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      handle: "",
      logo: "",
      banner: "",
      bio_ar: "",
      bio_en: "",
      tagline_ar: "",
      tagline_en: "",
      themeColor: "#7c3aed",
      countryCode: "962",
      phone: "",
      email: "",
      currency: Currency.JOD,
      minOrderAmount: 1,
      businessType: CreatorStoreBusinessType.INDIVIDUAL,
      registrationNumber: "",
      taxId: "",
      social_instagram: "",
      social_tiktok: "",
      social_facebook: "",
      social_youtube: "",
      social_x: "",
      social_snapchat: "",
      social_whatsapp: "",
      social_telegram: "",
      social_website: "",
    },
  });

  const selectedBusinessType = form.watch("businessType");
  const selectedThemeColor = form.watch("themeColor") || "#7c3aed";
  const watchHandle = form.watch("handle") || "";

  const {
    data: availabilityData,
    isLoading: isCheckingAvailability,
    isFetching,
    isError: isAvailabilityError,
    refetch: refetchAvailability,
    isDebouncing,
    isFormatValid: isHandleFormatValid,
  } = useHandleAvailabilityQuery({
    handle: watchHandle,
    enabled: watchHandle.length >= 3,
  });

  const isAvailabilityLoading =
    isCheckingAvailability || isFetching || isDebouncing;
  const availabilityResult = availabilityData?.data;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (availabilityResult && availabilityResult.available === false) {
      form.setError("handle", {
        type: "manual",
        message:
          availabilityResult.reason === HandleAvailabilityReason.TAKEN
            ? t("validations.handleTaken", { handle: `@${values.handle}` })
            : availabilityResult.reason === HandleAvailabilityReason.RESERVED
              ? t("validations.handleReserved")
              : availabilityResult.reason ===
                  HandleAvailabilityReason.RECENTLY_RELEASED
                ? t("validations.handleRecentlyReleased")
                : availabilityResult.reason === HandleAvailabilityReason.INVALID
                  ? t("validations.handleInvalid")
                  : t("validations.handleUnavailable"),
      });
      return;
    }

    await createMutation.mutateAsync(
      {
        ...values,
        handle: values.handle.toLowerCase().trim(),
        name_ar: values.name_ar.trim(),
        name_en: values.name_en.trim(),
        bio_ar: values.bio_ar || undefined,
        bio_en: values.bio_en || undefined,
        tagline_ar: values.tagline_ar || undefined,
        tagline_en: values.tagline_en || undefined,
        themeColor: values.themeColor || undefined,
        countryCode: values.countryCode || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        registrationNumber: values.registrationNumber || undefined,
        taxId: values.taxId || undefined,
        social_instagram: values.social_instagram || undefined,
        social_tiktok: values.social_tiktok || undefined,
        social_facebook: values.social_facebook || undefined,
        social_youtube: values.social_youtube || undefined,
        social_x: values.social_x || undefined,
        social_snapchat: values.social_snapchat || undefined,
        social_whatsapp: values.social_whatsapp || undefined,
        social_telegram: values.social_telegram || undefined,
        social_website: values.social_website || undefined,
        logo: logoFile,
        banner: bannerFile,
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
          {!bannerUrl && (
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white-50/20 text-xs font-semibold backdrop-blur-md mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {t("badge") || "Creator Storefront"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("title")}
              </h1>
              <p className="text-sm text-purple-100 mt-1 max-w-xl">
                {t("subtitle")}
              </p>
            </div>
          )}
        </div>
      </div>

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
                  {t("sections.branding")}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("sections.brandingDesc")}
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
                    <FormLabel className="text-sm font-semibold">
                      {t("fields.logo")} <RequiredStar />
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      {t("fields.logoHint")}
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
                    <FormLabel className="text-sm font-semibold">
                      {t("fields.banner")} <RequiredStar />
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      {t("fields.bannerHint")}
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
                    {t("fields.themeColor")}
                  </FormLabel>
                  <FormDescription className="text-xs text-gray-500">
                    {t("fields.themeColorHint")}
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

          {/* Section 3: Business & Commercial Settings */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {t("sections.business")}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("sections.businessDesc")}
                </p>
              </div>
            </div>

            {/* Business Type */}
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    {t("fields.businessType")}
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
                          {t("fields.individual")}
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
                          {t("fields.company")}
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
                      <FormLabel className="text-sm font-semibold">
                        {t("fields.registrationNumber")} <RequiredStar />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t(
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
                      <FormLabel className="text-sm font-semibold">
                        {t("fields.taxId")} <RequiredStar />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("fields.taxIdPlaceholder")}
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
                      {t("fields.currency")}
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
                            {tg("currencyUnits.jod")}{" "}
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
                      {t("fields.minOrderAmount")}
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
                        placeholder={t("fields.minOrderAmountPlaceholder")}
                        dir={isAr ? "rtl" : "ltr"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 2: Store Identity & Information */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {t("sections.identity")}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("sections.identityDesc")}
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
                    <FormLabel className="text-sm font-semibold">
                      {t("fields.nameAr")} <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("fields.nameArPlaceholder")}
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
                    <FormLabel className="text-sm font-semibold">
                      {t("fields.nameEn")} <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("fields.nameEnPlaceholder")}
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
                  <FormLabel className="text-sm font-semibold">
                    {t("fields.handle")} <RequiredStar />
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
                        value={field.value}
                        onChange={(e) => {
                          const clean = e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "");
                          field.onChange(clean);
                        }}
                        placeholder={t("fields.handlePlaceholder")}
                        className="pl-8 rtl:pl-3 rtl:pr-8 font-mono lowercase"
                        dir="ltr"
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    {t("fields.handleHint")}
                    <span className="font-semibold text-purple-700">
                      {watchHandle || "your-handle"}
                    </span>
                  </FormDescription>

                  {/* Live Handle Availability Status Line */}
                  <HandleAvailabilityStatus
                    handle={watchHandle}
                    isFormatValid={isHandleFormatValid}
                    isAvailabilityLoading={isAvailabilityLoading}
                    isAvailabilityError={isAvailabilityError}
                    availabilityResult={availabilityResult}
                    onRetry={() => refetchAvailability()}
                    className="pt-1"
                  />

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
                      {t("fields.taglineAr")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("fields.taglineArPlaceholder")}
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
                      {t("fields.taglineEn")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("fields.taglineEnPlaceholder")}
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
                      {t("fields.bioAr")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        maxLength={validationConfig.creatorStore.bioMaxChars}
                        placeholder={t("fields.bioArPlaceholder")}
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
                      {t("fields.bioEn")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        maxLength={validationConfig.creatorStore.bioMaxChars}
                        placeholder={t("fields.bioEnPlaceholder")}
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

          {/* Section 4: Contact Details */}
          <div className="rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {t("sections.contact")}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("sections.contactDesc")}
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
                      {t("fields.countryCode")}
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
                      {t("fields.phone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("fields.phonePlaceholder")}
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
                    {t("fields.email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder={t("fields.emailPlaceholder")}
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
                  {t("sections.social")}
                </h2>
                <p className="text-xs text-gray-500">
                  {t("sections.socialDesc")}
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
                      {t("fields.social_instagram")}
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
                      {t("fields.social_tiktok")}
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
                      {t("fields.social_facebook")}
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
                      {t("fields.social_youtube")}
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
                      {t("fields.social_x")}
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
                      {t("fields.social_whatsapp")}
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
                      {t("fields.social_telegram")}
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
                      {t("fields.social_snapchat")}
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
                      {t("fields.social_website")}
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
          </div>

          {/* Submit & Cancel Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={createMutation.isPending}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                {t("cancelBtn")}
              </button>
            )}

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white-50 px-6 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>{t("submitBtn")}</span>
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

export default memo(CreateCreatorStoreForm);
