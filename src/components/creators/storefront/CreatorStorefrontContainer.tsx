"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Store,
  BadgeCheck,
  Share2,
  Check,
  Mail,
  MapPin,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Building2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatorStore } from "@/types/creators/creatorStore";
import { CreatorStoreBusinessType } from "@/enums/creators/creatorStoreBusinessType.enum";
import { usePublicCreatorStoreQuery } from "@/hooks/react-query/creators/usePublicCreatorStoreQuery";
import { showSuccessToast } from "@/components/shared/CustomToast";
import CreatorStoreSkeleton from "../dashboard/CreatorStoreSkeleton";
import { isArabicLocale } from "@/config/locales.config";
import assets from "@public/assets/assets.json";

interface CreatorStorefrontContainerProps {
  handle: string;
  initialStore?: CreatorStore | null;
}

export const CreatorStorefrontContainer: React.FC<
  CreatorStorefrontContainerProps
> = ({ handle, initialStore }) => {
  const t = useTranslations("routes.creators.storefront");
  const tg = useTranslations("general");
  const locale = useLocale();
  const isAr = isArabicLocale(locale);
  const cleanHandle = handle.replace(/^@/, "").toLowerCase().trim();

  const [activeTab, setActiveTab] = useState<"products" | "about">("products");
  const [copied, setCopied] = useState(false);

  const { data: storeResponse, isLoading } = usePublicCreatorStoreQuery({
    handle: cleanHandle,
    enabled: !initialStore,
  });

  const store = initialStore || storeResponse?.data;

  console.log({ store });

  if (isLoading && !store) {
    return <CreatorStoreSkeleton />;
  }

  if (!store) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
          <Store className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("notFoundTitle")}
        </h1>
        <p className="text-gray-500 max-w-md mb-8">
          {t("notFoundDesc", { handle: `@${cleanHandle}` })}
        </p>
        <Link href={`/${locale}`}>
          <Button className="rounded-xl px-6 bg-purple-600 hover:bg-purple-700 text-white-50">
            {t("backToHome")}
          </Button>
        </Link>
      </div>
    );
  }

  const localizedName = isAr
    ? store.name?.ar || store.name?.en || cleanHandle
    : store.name?.en || store.name?.ar || cleanHandle;

  const localizedBio = isAr
    ? store.bio?.ar || store.bio?.en || ""
    : store.bio?.en || store.bio?.ar || "";

  const localizedTagline = isAr
    ? store.tagline?.ar || store.tagline?.en || ""
    : store.tagline?.en || store.tagline?.ar || "";

  const themeColor = store.themeColor || "#7c3aed";
  const bannerUrl = store.banner?.url;
  const logoUrl = store.logo?.url;

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    const origin = window.location.origin;
    const shareUrl = `${origin}/${locale}/@${store.handle || cleanHandle}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: localizedName,
          text: localizedTagline || localizedBio || localizedName,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        showSuccessToast({
          title: t("linkCopied"),
          description: shareUrl,
          dismissText: tg("toast.dismissText"),
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore user aborting native share
    }
  };

  const socialLinksList = [
    {
      key: "instagram",
      value: store.socialLinks?.instagram,
      iconSrc: assets.image.svg.social.instagram,
      color: "hover:border-pink-300 hover:bg-pink-50/50",
      getUrl: (val: string) =>
        val.startsWith("http")
          ? val
          : `https://instagram.com/${val.replace(/^@/, "")}`,
    },
    {
      key: "tiktok",
      value: store.socialLinks?.tiktok,
      iconSrc: assets.image.svg.social.tiktok,
      color: "hover:border-neutral-400 hover:bg-neutral-50",
      getUrl: (val: string) =>
        val.startsWith("http")
          ? val
          : `https://tiktok.com/@${val.replace(/^@/, "")}`,
    },
    {
      key: "youtube",
      value: store.socialLinks?.youtube,
      iconSrc: assets.image.svg.social.youtube,
      color: "hover:border-red-300 hover:bg-red-50/50",
      getUrl: (val: string) =>
        val.startsWith("http")
          ? val
          : `https://youtube.com/@${val.replace(/^@/, "")}`,
    },
    {
      key: "x",
      value: store.socialLinks?.x,
      iconSrc: assets.image.svg.social.x,
      color: "hover:border-gray-400 hover:bg-gray-50",
      getUrl: (val: string) =>
        val.startsWith("http") ? val : `https://x.com/${val.replace(/^@/, "")}`,
    },
    {
      key: "facebook",
      value: store.socialLinks?.facebook,
      iconSrc: assets.image.svg.social.facebook,
      color: "hover:border-blue-300 hover:bg-blue-50/50",
      getUrl: (val: string) =>
        val.startsWith("http") ? val : `https://facebook.com/${val}`,
    },
    {
      key: "snapchat",
      value: store.socialLinks?.snapchat,
      iconSrc: assets.image.svg.social.snapchat,
      color: "hover:border-yellow-300 hover:bg-yellow-50/50",
      getUrl: (val: string) =>
        val.startsWith("http") ? val : `https://snapchat.com/add/${val}`,
    },
    {
      key: "whatsapp",
      value: store.socialLinks?.whatsapp,
      iconSrc: assets.image.svg.social.whatsapp,
      color: "hover:border-emerald-300 hover:bg-emerald-50/50",
      getUrl: (val: string) =>
        val.startsWith("http")
          ? val
          : `https://wa.me/${val.replace(/[^0-9]/g, "")}`,
    },
    {
      key: "telegram",
      value: store.socialLinks?.telegram,
      iconSrc: assets.image.svg.social.telegram,
      color: "hover:border-sky-300 hover:bg-sky-50/50",
      getUrl: (val: string) =>
        val.startsWith("http") ? val : `https://t.me/${val.replace(/^@/, "")}`,
    },
    {
      key: "website",
      value: store.socialLinks?.website,
      iconSrc: assets.image.svg.social.website,
      color: "hover:border-purple-300 hover:bg-purple-50/50",
      getUrl: (val: string) =>
        val.startsWith("http") ? val : `https://${val}`,
    },
  ].filter((item) => Boolean(item.value && item.value.trim()));

  return (
    <div
      className="min-h-screen bg-gray-50/50 pb-20"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* 1. Hero Cover Banner */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-900 overflow-hidden">
        {bannerUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `url("${bannerUrl.replace(/"/g, '\\"')}")`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        ) : (
          <div
            className="absolute inset-0 opacity-80"
            style={{
              background: `linear-gradient(135deg, ${themeColor}dd 0%, #1e1b4b 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          </div>
        )}
      </div>

      {/* 2. Main Store Header Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10">
        <div className="bg-white-50 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100/80 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Store Avatar & Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-start">
              {/* Logo / Avatar */}
              <div
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white-50 shadow-xl shrink-0 bg-white-50 -mt-14 sm:-mt-16"
                style={{ borderColor: "#ffffff" }}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={localizedName}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white-50 text-3xl font-black"
                    style={{ backgroundColor: themeColor }}
                  >
                    {localizedName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Names & Handle */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {localizedName}
                  </h1>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-white-50 shadow-2xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>{t("verifiedCreator")}</span>
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-gray-500">
                  <span
                    className="font-mono text-gray-600 font-medium"
                    dir="ltr"
                  >
                    @{store.handle || cleanHandle}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    {store.businessType === CreatorStoreBusinessType.COMPANY ? (
                      <>
                        <Building2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>{t("companyStore")}</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5 text-purple-600" />
                        <span>{t("individualCreator")}</span>
                      </>
                    )}
                  </span>
                </div>

                {localizedTagline && (
                  <p className="text-sm font-medium text-gray-700 italic pt-1">
                    &ldquo;{localizedTagline}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Actions: Share / Copy Link / Contact */}
            <div className="flex items-center justify-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="rounded-xl border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 gap-2 h-10 px-4 text-xs font-semibold shadow-2xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-purple-600" />
                    <span>{t("shareStore")}</span>
                  </>
                )}
              </Button>

              {store.email && (
                <a href={`mailto:${store.email}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 gap-2 h-10 px-4 text-xs font-semibold shadow-2xs"
                  >
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span>{t("contact")}</span>
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Bio text */}
          {localizedBio && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl whitespace-pre-line">
                {localizedBio}
              </p>
            </div>
          )}

          {/* Social Media Bar */}
          {socialLinksList.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("followMe")}:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinksList.map((item) => (
                  <a
                    key={item.key}
                    href={item.getUrl(item.value!)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center transition-all hover:bg-white-50 hover:shadow-sm hover:scale-105 ${item.color}`}
                    title={item.key}
                    aria-label={item.key}
                  >
                    <Image
                      src={item.iconSrc}
                      alt={item.key}
                      width={18}
                      height={18}
                      className="w-4.5 h-4.5 object-contain"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Navigation Tabs */}
        <div className="mt-8 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 pb-4 text-sm sm:text-base font-bold transition-all relative ${
                activeTab === "products"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t("tabs.products")}</span>
              {activeTab === "products" && (
                <span
                  className="absolute bottom-0 inset-x-0 h-0.5 rounded-full"
                  style={{ backgroundColor: themeColor }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-2 pb-4 text-sm sm:text-base font-bold transition-all relative ${
                activeTab === "about"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t("tabs.about")}</span>
              {activeTab === "about" && (
                <span
                  className="absolute bottom-0 inset-x-0 h-0.5 rounded-full"
                  style={{ backgroundColor: themeColor }}
                />
              )}
            </button>
          </div>
        </div>

        {/* 4. Tab Content */}
        <div className="mt-8">
          {activeTab === "products" && (
            <div className="space-y-6">
              {/* Products Empty / Coming Soon placeholder */}
              <div className="bg-white-50 rounded-3xl p-12 text-center border border-gray-100 shadow-2xs">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white-50 shadow-md mb-4"
                  style={{ backgroundColor: themeColor }}
                >
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t("noProductsYetTitle")}
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  {t("noProductsYetDesc", { name: localizedName })}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-purple-50 text-purple-700">
                  <Sparkles className="w-4 h-4" />
                  <span>{t("stayTuned")}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store Details Card */}
              <div className="bg-white-50 rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs space-y-5">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-purple-600" />
                  <span>{t("aboutSection.businessInfo")}</span>
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">
                      {t("aboutSection.businessType")}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {store.businessType === CreatorStoreBusinessType.COMPANY
                        ? t("companyStore")
                        : t("individualCreator")}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">
                      {t("aboutSection.currency")}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {store.currency || "JOD"}
                    </span>
                  </div>

                  {store.minOrderAmount !== undefined &&
                    store.minOrderAmount > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="text-gray-500">
                          {t("aboutSection.minOrder")}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {store.minOrderAmount} {store.currency || "JOD"}
                        </span>
                      </div>
                    )}

                  {store.email && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">
                        {t("aboutSection.email")}
                      </span>
                      <a
                        href={`mailto:${store.email}`}
                        className="font-semibold text-purple-600 hover:underline"
                        dir="ltr"
                      >
                        {store.email}
                      </a>
                    </div>
                  )}

                  {store.phone && (
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">
                        {t("aboutSection.phone")}
                      </span>
                      <a
                        href={`tel:${store.countryCode || ""}${store.phone}`}
                        className="font-semibold text-purple-600 hover:underline"
                        dir="ltr"
                      >
                        +{store.countryCode || "962"} {store.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Policies & Buyer Protection Card */}
              <div className="bg-white-50 rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs space-y-5">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t("aboutSection.buyerProtection")}</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">
                        {t("aboutSection.verifiedCartjoStore")}
                      </h4>
                      <p className="text-xs text-emerald-800 mt-1">
                        {t("aboutSection.verifiedCartjoStoreDesc")}
                      </p>
                    </div>
                  </div>

                  {store.pickupAddress?.city && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {t("aboutSection.shippingLocation")}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {store.pickupAddress.city},{" "}
                          {store.pickupAddress.country || "Jordan"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorStorefrontContainer;
