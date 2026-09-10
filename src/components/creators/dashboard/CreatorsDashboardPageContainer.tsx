"use client";

import { useState } from "react";
import { useCreatorStoreQuery } from "@/hooks/react-query/creators/useCreatorStoreQuery";
import { useAuthContext } from "@/hooks/useAuthContext";
import Link from "next/link";
import {
  CreatorStoreStatus,
  SUBMITTABLE_STORE_STATUSES,
} from "@/enums/creators/creatorStoreStatus.enum";
import { CreatorStoreBusinessType } from "@/enums/creators/creatorStoreBusinessType.enum";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import CreatorNoStore from "./CreatorNoStore";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import StatusBadge from "@/components/shared/StatusBadge";
import StoreSocialLinksList from "@/components/shared/StoreSocialLinksList";
import { isArabicLocale } from "@/config/locales.config";
import { Locale } from "@/types/locale";
import {
  CircleCheck,
  Pencil,
  ExternalLink,
  Landmark,
  MapPin,
  Package,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import PageLoader from "@/components/shared/PageLoader";
import StoreHandleCard from "@/components/creators/store/handle/StoreHandleCard";
import SubmitForReviewDialog from "./SubmitForReviewDialog";

const CreatorsDashboardPageContainer = ({ locale }: { locale: Locale }) => {
  const isArabic = isArabicLocale(locale);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const t = useTranslations(
    "routes.creators.routes.dashboard.components.CreatorsDashboardPageContainer",
  );
  const tg = useTranslations("general");

  const { isSessionLoading } = useAuthContext();

  const { data, isLoading, error, isError } = useCreatorStoreQuery();

  const store = data?.data;
  const showLoader = isLoading || isSessionLoading;
  const showNoData = !store;

  if (showLoader) {
    return <PageLoader />;
  }

  if (showNoData) {
    return <CreatorNoStore />;
  }

  if (isError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage message={error?.message || tg("data.failed")} />
      </div>
    );
  }

  const isSubmittable = SUBMITTABLE_STORE_STATUSES.includes(store.status);

  const hasPayout = Boolean(
    store.payoutInfo?.bankName?.trim() &&
    store.payoutInfo?.accountHolderName?.trim() &&
    store.payoutInfo?.iban?.trim() &&
    store.payoutInfo?.accountNumber?.trim(),
  );

  const hasPickup = Boolean(
    store.pickupAddress?.country?.trim() &&
    store.pickupAddress?.city?.trim() &&
    store.pickupAddress?.street?.trim() &&
    store.pickupAddress?.building?.trim(),
  );

  const hasBranding = Boolean(
    store.logo?.url &&
    store.banner?.url &&
    store.name?.ar?.trim() &&
    store.name?.en?.trim() &&
    store.handle?.trim(),
  );

  const isCompany = store.businessType === CreatorStoreBusinessType.COMPANY;
  const hasCompanyDocs = isCompany
    ? Boolean(store.registrationNumber?.trim() && store.taxId?.trim())
    : true;

  const isStoreReadyForReview =
    hasPayout && hasPickup && hasBranding && hasCompanyDocs;

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const businessTypeLabel =
    store.businessType === CreatorStoreBusinessType.INDIVIDUAL
      ? t(`businessTypes.${CreatorStoreBusinessType.INDIVIDUAL}`)
      : store.businessType === CreatorStoreBusinessType.COMPANY
        ? t(`businessTypes.${CreatorStoreBusinessType.COMPANY}`)
        : (store?.businessType as string)?.replace(/_/g, " ");

  return (
    <div className="space-y-6">
      {/* Banner + logo header */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="relative h-40 w-full bg-gray-100">
          <ImageWithFallback
            src={store.banner?.url}
            alt={store.name?.en ?? t("storeBanner")}
            className="object-cover"
          />
        </div>
        <div className="flex items-end gap-4 px-6 pb-5">
          <div className="-mt-8 h-20 w-20 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-gray-100 shadow-sm relative">
            <ImageWithFallback
              src={store.logo?.url}
              alt={store.name?.en ?? t("storeLogo")}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-3 pt-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2 capitalize">
                  {isArabic ? store.name?.ar : store.name?.en}
                </h1>
                {store.isVerified && (
                  <span
                    title={t("verified")}
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-100 text-sky-600"
                  >
                    <CircleCheck className="w-4 h-4" />
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">@{store.handle}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={store.status} />

              {store.vacationMode && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  {t("onVacation")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Store Handle & Vanity URL section */}
      <StoreHandleCard store={store} />

      {/* Launch / Review Readiness Banner */}
      {isSubmittable && (
        <div
          className={`rounded-xl border p-5 transition-all ${
            isStoreReadyForReview
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-amber-200 bg-amber-50/70"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  isStoreReadyForReview
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {isStoreReadyForReview ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3
                  className={`text-sm font-semibold ${
                    isStoreReadyForReview
                      ? "text-emerald-900"
                      : "text-amber-900"
                  }`}
                >
                  {isStoreReadyForReview
                    ? t("readiness.readyTitle")
                    : t("readiness.incompleteTitle")}
                </h3>
                <p
                  className={`text-xs ${
                    isStoreReadyForReview
                      ? "text-emerald-700"
                      : "text-amber-700"
                  }`}
                >
                  {isStoreReadyForReview
                    ? t("readiness.readyDesc")
                    : t("readiness.incompleteDesc")}
                </p>

                {!isStoreReadyForReview && (
                  <div className="flex flex-wrap items-center gap-2 pt-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        hasPayout
                          ? "bg-emerald-100/90 text-emerald-800"
                          : "bg-amber-100 text-amber-900 border border-amber-300/80"
                      }`}
                    >
                      {hasPayout ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {t("payout.title")}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        hasPickup
                          ? "bg-emerald-100/90 text-emerald-800"
                          : "bg-amber-100 text-amber-900 border border-amber-300/80"
                      }`}
                    >
                      {hasPickup ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {t("pickup.title")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {!isStoreReadyForReview ? (
                <Link
                  href={`/${locale}/creators/dashboard/store/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white-50 hover:bg-amber-700 transition-colors shadow-xs"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {t("readiness.completeBtn")}
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white-50 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("actions.submitForReview")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tagline / bio */}
      {(store.tagline?.en ||
        store.tagline?.ar ||
        store.bio?.en ||
        store.bio?.ar) && (
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          {store.tagline && (
            <p className="font-medium text-gray-800">
              {isArabic ? store.tagline.ar : store.tagline.en}
            </p>
          )}
          {store.bio && (
            <p className="mt-1 text-sm text-gray-500">
              {isArabic ? store.bio.ar : store.bio.en}
            </p>
          )}
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={t("stats.currency")} value={store.currency} />
        <StatCard
          label={t("stats.commission")}
          value={`${store.commissionRate}%`}
        />
        <StatCard
          label={t("stats.minOrder")}
          value={`${store.minOrderAmount} ${store.currency}`}
        />
        <StatCard label={t("stats.businessType")} value={businessTypeLabel} />
      </div>

      {/* Contact & Social Links */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          {t("contact.title")}
        </h3>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-400">{t("contact.phone")}</dt>
            <dd className="text-gray-800">
              {store.countryCode && `+${store.countryCode} `}
              {store.phone || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-400">{t("contact.email")}</dt>
            <dd className="text-gray-800">{store.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">{t("contact.socialLinks")}</dt>
            <dd className="mt-1">
              <StoreSocialLinksList links={store.socialLinks} size="sm" />
            </dd>
          </div>
        </dl>
      </div>

      {/* Payout & Pickup Address Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payout Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-purple-600" />
              {t("payout.title")}
            </h3>
            <Link
              href={`/${locale}/creators/dashboard/store/edit`}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              {t("actions.editStore")}
            </Link>
          </div>
          {store.payoutInfo?.bankName || store.payoutInfo?.iban ? (
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-gray-400">{t("payout.bankName")}</dt>
                <dd className="font-medium text-gray-800">
                  {store.payoutInfo.bankName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">{t("payout.accountHolder")}</dt>
                <dd className="font-medium text-gray-800">
                  {store.payoutInfo.accountHolderName || "—"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-400">{t("payout.iban")}</dt>
                <dd className="font-mono text-gray-800 truncate">
                  {store.payoutInfo.iban || "—"}
                </dd>
              </div>
              {store.payoutInfo.cliqAlias && (
                <div className="col-span-2 pt-1 border-t border-gray-100 flex items-center justify-between">
                  <dt className="text-gray-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {t("payout.cliqAlias")}
                  </dt>
                  <dd
                    className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md"
                    dir="ltr"
                  >
                    {store.payoutInfo.cliqAlias}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-xs text-gray-400 italic">
              {t("payout.notConfigured")}
            </p>
          )}
        </div>

        {/* Pickup Address */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              {t("pickup.title")}
            </h3>
            <Link
              href={`/${locale}/creators/dashboard/store/edit`}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              {t("actions.editStore")}
            </Link>
          </div>
          {store.pickupAddress?.city || store.pickupAddress?.street ? (
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-gray-400">{t("pickup.city")}</dt>
                <dd className="font-medium text-gray-800">
                  {store.pickupAddress.city || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">{t("pickup.building")}</dt>
                <dd className="font-medium text-gray-800">
                  {store.pickupAddress.building || "—"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-gray-400">{t("pickup.street")}</dt>
                <dd className="font-medium text-gray-800">
                  {store.pickupAddress.street || "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-xs text-gray-400 italic">
              {t("pickup.notConfigured")}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-medium text-gray-700">
          {t("actions.title")}
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/${locale}/creators/dashboard/store/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white-50 hover:bg-purple-700 transition-colors shadow-xs"
          >
            <Pencil className="w-3.5 h-3.5" />
            {t("actions.editStore")}
          </Link>

          <Link
            href={`/${locale}/@${store.handle}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            {t("actions.viewPublicStore")}
          </Link>

          <Link
            href={`/${locale}/creators/dashboard/store`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <Package className="w-3.5 h-3.5 text-gray-500" />
            {t("actions.myProducts")}
          </Link>

          {isSubmittable && (
            <button
              type="button"
              onClick={() => setIsReviewDialogOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white-50 hover:bg-violet-700 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t("actions.submitForReview")}
            </button>
          )}

          {store.status === CreatorStoreStatus.ACTIVE &&
            !store.vacationMode && (
              <ActionButton label={t("actions.turnOnVacation")} />
            )}
          {store.vacationMode && (
            <ActionButton label={t("actions.turnOffVacation")} />
          )}

          {store.status === CreatorStoreStatus.ACTIVE && (
            <ActionButton label={t("actions.closeStore")} danger />
          )}
          {store.status === CreatorStoreStatus.CLOSED && (
            <ActionButton label={t("actions.reopenStore")} />
          )}
        </div>
      </div>

      {/* Submit for Review Modal Dialog */}
      <SubmitForReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        store={store}
      />
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="mt-1 truncate text-sm font-medium capitalize text-gray-900">
      {value}
    </p>
  </div>
);

const ActionButton = ({
  label,
  primary,
  danger,
}: {
  label: string;
  primary?: boolean;
  danger?: boolean;
}) => (
  <button
    type="button"
    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      primary
        ? "bg-violet-600 text-white-50 hover:bg-violet-700"
        : danger
          ? "border border-red-200 text-red-600 hover:bg-red-50"
          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

export default CreatorsDashboardPageContainer;
