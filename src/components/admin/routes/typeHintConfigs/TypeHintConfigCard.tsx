import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";
import { BaseResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { TypeHintConfig } from "@/types/typeHintConfig.type";
import TypeHintConfigCardActions from "./TypeHintConfigCardActions";
import EditTypeHintConfigForm from "./EditTypeHintConfigForm";

type TypeHintConfigCardProps = {
  item: TypeHintConfig;
  deleteTypeHintConfig: (
    accessToken: string | null,
    typeHintConfigId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteTypeHintConfig: (
    accessToken: string | null,
    typeHintConfigId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  accessToken: string | null;
  switchTypeHintConfigActiveStatus: (
    accessToken: string | null,
    lang: string,
    isActive: boolean,
    typeHintConfigId: string
  ) => Promise<BaseResponse>;
  queryKey: string;
};

const TypeHintConfigCard = ({
  item: typeHintConfig,
  deleteTypeHintConfig,
  unDeleteTypeHintConfig,
  switchTypeHintConfigActiveStatus,
  queryKey,
  accessToken,
}: TypeHintConfigCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      {/* Active / Deleted States */}
      <div className="w-auto flex items-end justify-end gap-1 mb-1">
        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
            typeHintConfig.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {typeHintConfig.isActive
            ? t("general.items.states.active")
            : t("general.items.states.inactive")}
        </span>

        {typeHintConfig.isDeleted && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
            {t("general.items.states.deleted")}
          </span>
        )}
      </div>

      {/* Title / Label */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-900 capitalize rtl:text-right ltr:text-left">
          {isArabic ? typeHintConfig.label?.ar : typeHintConfig.label?.en}
        </h3>

        <p className="text-xs text-gray-500">
          {t("general.others.key", { default: "Key" })}:{" "}
          <span className="font-mono">{typeHintConfig.key}</span>
        </p>
      </div>

      {/* Priority */}
      <p className="text-xs text-gray-600 mt-1">
        {t("general.others.priority", { default: "Priority" })}:{" "}
        <span className="font-medium">{typeHintConfig.priority}</span>
      </p>

      {/* Created / Updated Dates */}
      <div className="text-xs text-gray-600 mt-2 border-t py-3 flex flex-wrap gap-2">
        {typeHintConfig.createdAt && (
          <p>
            {t("general.others.created")}:{" "}
            {new Date(typeHintConfig.createdAt).toLocaleDateString("en-US")}
          </p>
        )}
        {typeHintConfig.updatedAt && (
          <p>
            {t("general.others.updated")}:{" "}
            {new Date(typeHintConfig.updatedAt).toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      {!typeHintConfig.isSystem && (
        <div className="mt-auto">
          <TypeHintConfigCardActions
            cardItem={typeHintConfig}
            deleteFn={deleteTypeHintConfig}
            unDeleteFn={unDeleteTypeHintConfig}
            accessToken={accessToken}
            switchUserActiveStatusFn={switchTypeHintConfigActiveStatus}
            queryKey={queryKey}
            showEditButton={true}
            renderEditForm={() => (
              <EditTypeHintConfigForm typeHintConfig={typeHintConfig} />
            )}
          />
        </div>
      )}
    </div>
  );
};

export default memo(TypeHintConfigCard);
