import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BaseResponse } from "@/types/service-response.type";
import { Logo } from "@/types/logo";
import { Locale } from "@/types/locale";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import LogoCardActions from "./LogoCardActions";
import EditLogoForm from "./EditLogoForm";
import { isArabicLocale } from "@/config/locales.config";
import { LogoType } from "@/enums/logoType.enum";

type LogoCardProps = {
  item: Logo;
  deleteLogo: (
    userId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteLogo: (
    userId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  switchLogoActiveStatus: (
    lang: string,
    isActive: boolean,
    userId: string
  ) => Promise<BaseResponse>;
  queryKey: string;
};

const LogoCard = ({
  item: logo,
  deleteLogo,
  unDeleteLogo,
  switchLogoActiveStatus,
  queryKey,
}: LogoCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="w-auto flex items-end justify-end gap-1 mb-1">
        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${logo.type === LogoType.MAIN
              ? "bg-amber-100 text-amber-500"
              : "bg-blue-100 text-blue-800"
            }`}
        >
          {t(`routes.dashboard.routes.logos.components.LogoCard.type.${logo.type}`)}
        </span>

        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${logo.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
            }`}
        >
          {logo.isActive
            ? t("general.items.states.active")
            : t("general.items.states.inactive")}
        </span>

        {logo.isDeleted && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
            {t("general.items.states.deleted")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200">
          <ImageWithFallback
            src={isArabic ? logo?.media?.ar?.url : logo?.media?.en?.url}
            alt={isArabic ? logo.altText?.ar : logo.altText?.en}
            width={40}
            height={40}
            useFill={false}
            className="object-cover w-full h-full"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 capitalize">
          {isArabic ? logo.name?.ar : logo.name?.en}
        </h3>
      </div>

      <div className="text-xs text-gray-600 mb-4 my-1">
        <p>
          {t("general.others.created")}:{" "}
          {new Date(logo.createdAt).toLocaleDateString("en-US")}
        </p>
        {logo.updatedAt && (
          <p>
            {t("general.others.updated")}:{" "}
            {new Date(logo.updatedAt).toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <LogoCardActions
          cardItem={logo}
          deleteFn={deleteLogo}
          unDeleteFn={unDeleteLogo}
          switchUserActiveStatusFn={switchLogoActiveStatus}
          queryKey={queryKey}
          showEditButton={true}
          renderEditForm={() => <EditLogoForm logo={logo} />}
        />
      </div>
    </div>
  );
};

export default memo(LogoCard);
