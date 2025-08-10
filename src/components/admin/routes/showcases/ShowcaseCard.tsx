import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { isArabicLocale } from "@/config/locales.config";

import { BaseResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Showcase } from "@/types/showcase.type";

import ShowcasesCardActions from "./ShowcasesCardActions";
import EditShowcaseForm from "./EditShowcaseForm";

type ShowcaseCardProps = {
  item: Showcase;
  deleteShowcase: (
    accessToken: string,
    showcaseId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteShowcase: (
    accessToken: string,
    showcaseId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  accessToken: string;
  switchShowcaseActiveStatus: (
    token: string,
    lang: string,
    isActive: boolean,
    showcaseId: string
  ) => Promise<BaseResponse>;
  queryKey: string;
};

const ShowcaseCard = ({
  item: showcase,
  deleteShowcase,
  unDeleteShowcase,
  accessToken,
  switchShowcaseActiveStatus,
  queryKey,
}: ShowcaseCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="w-auto flex items-end justify-end gap-1 mb-1">
        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
            showcase.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {showcase.isActive
            ? t("general.items.states.active")
            : t("general.items.states.inactive")}
        </span>

        {showcase.isDeleted && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
            {t("general.items.states.deleted")}
          </span>
        )}

        {showcase.type && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-blue-100 text-blue-800 capitalize">
            {showcase.type}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-900 capitalize rtl:text-right ltr:text-left">
          {isArabic ? showcase?.title?.ar : showcase?.title?.en}
        </h3>

        {showcase?.description && (
          <p className="text-xs text-gray-600 rtl:text-right ltr:text-left">
            {isArabic ? showcase?.description?.ar : showcase?.description?.en}
          </p>
        )}
      </div>

      {/* Show All Button Info */}
      {showcase?.showAllButtonText && showcase?.showAllButtonLink && (
        <div className="text-xs text-gray-600 mt-2 border-t py-3">
          <div className="flex flex-col gap-1">
            <p className="font-medium">
              {t("general.others.button_text", { default: "Button Text" })}:{" "}
              <span className="font-normal">
                {isArabic
                  ? showcase?.showAllButtonText?.ar
                  : showcase?.showAllButtonText?.en}
              </span>
            </p>
            <p className="font-medium">
              {t("general.others.button_link", { default: "Button Link" })}:{" "}
              <a
                href={showcase.showAllButtonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-blue-600 hover:text-blue-800 underline break-all"
              >
                {showcase.showAllButtonLink}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Created/Updated Info */}
      <div className="text-xs text-gray-600 mt-2 border-t py-3 flex flex-wrap gap-2">
        {showcase.createdAt && (
          <p>
            {t("general.others.created")}:{" "}
            {new Date(showcase.createdAt).toLocaleDateString("en-US")}
          </p>
        )}
        {showcase.updatedAt && (
          <p>
            {t("general.others.updated")}:{" "}
            {new Date(showcase.updatedAt).toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      {/* Creator Info */}
      {showcase?.createdBy && (
        <div className="text-xs text-gray-600 mt-2 border-t py-3">
          <p>
            {t("general.others.created_by", { default: "Created By" })}:{" "}
            <span className="font-medium">
              {showcase.createdBy.firstName} {showcase.createdBy.lastName}
            </span>
            {showcase.createdBy.email && (
              <span className="text-gray-500 ml-1">
                ({showcase.createdBy.email})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Date Range (only if both dates exist) */}
      {showcase?.startDate && showcase.endDate && (
        <div className="text-xs text-gray-600 my-1 border-y py-3 mb-3 flex flex-col gap-1">
          <p>
            {t("general.date.startDate")}:{" "}
            {new Date(showcase.startDate).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
          <p>
            {t("general.date.endDate")}:{" "}
            {new Date(showcase.endDate).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      )}

      <div className="mt-auto">
        <ShowcasesCardActions
          cardItem={showcase}
          deleteFn={deleteShowcase}
          unDeleteFn={unDeleteShowcase}
          accessToken={accessToken}
          switchUserActiveStatusFn={switchShowcaseActiveStatus}
          queryKey={queryKey}
          showEditButton={true}
          renderEditForm={() => <EditShowcaseForm showcase={showcase} />}
        />
      </div>
    </div>
  );
};

export default memo(ShowcaseCard);
