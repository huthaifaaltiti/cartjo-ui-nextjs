import { memo } from "react";
import { useTranslations } from "next-intl";

import { BaseResponse } from "@/types/service-response.type";
import { Logo } from "@/types/logo";
import { Locale } from "@/types/locale";

import ImageWithFallback from "@/components/shared/ImageWithFallback";
import LogoCardActions from "./LogoCardActions";
import EditLogoForm from "./EditLogoForm";

type LogoCardProps = {
  item: Logo;
  deleteLogo: (
    accessToken: string,
    userId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteLogo: (
    accessToken: string,
    userId: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  accessToken: string;
  switchLogoActiveStatus: (
    token: string,
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
  accessToken,
  switchLogoActiveStatus,
  queryKey,
}: LogoCardProps) => {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="w-auto flex items-end justify-end gap-1 mb-1">
        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
            logo.isActive
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
            src={logo?.media?.url}
            alt={logo.altText || logo.name}
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 capitalize">
          {logo.name}
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
          accessToken={accessToken}
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
