import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Banner } from "@/types/banner.type";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import BannersCardActions from "./BannersCardActions";
import { isArabicLocale } from "@/config/locales.config";
import EditBannerForm from "./EditBannerForm";
import { BANNERS_QUERY_KEY } from "@/hooks/react-query/query-options/banners";

type BannerCardProps = {
  item: Banner;

  deleteBanner: (bannerId: string, lang: string) => Promise<any>;

  unDeleteBanner: (bannerId: string, lang: string) => Promise<any>;

  switchBannerActiveStatus: (
    bannerId: string,
    lang: string,
    isActive: boolean,
  ) => Promise<any>;
};

const BannerCard = ({
  item: banner,
  deleteBanner,
  unDeleteBanner,
  switchBannerActiveStatus,
}: BannerCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col">
      <div className="w-auto flex items-end justify-end gap-1 mb-1">
        <span
          className={`px-[5px] py-[0.8px] text-[10px] rounded-full ${
            banner.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {banner.isActive
            ? t("general.items.states.active")
            : t("general.items.states.inactive")}
        </span>

        {banner.isDeleted && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
            {t("general.items.states.deleted")}
          </span>
        )}

        {banner.isExpired && (
          <span className="ml-2 px-[5px] py-[0.8px] text-[10px] rounded-full bg-gray-200 text-gray-700">
            {t("general.items.states.expired")}
          </span>
        )}

        {banner.isDefault && (
          <span
            className={`px-[5px] py-[0.8px] text-[10px] rounded-full bg-orange-100 text-orange-800`}
          >
            {t("general.items.states.default")}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full h-12 rounded overflow-hidden bg-gray-100 border border-gray-200">
          <ImageWithFallback
            src={isArabic ? banner?.media?.ar?.url : banner?.media?.en?.url}
            alt={banner?.title?.en}
            width={40}
            height={40}
            useFill={false}
            className="object-cover w-full h-full"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 capitalize rtl:text-right ltr:text-left">
          {isArabic ? banner?.title?.ar : banner?.title?.en}
        </h3>
      </div>

      <div className="text-xs text-gray-600 mt-2 border-t py-3 flex items-center gap-1">
        <p>
          {t("general.others.created")}:{" "}
          {new Date(banner.createdAt).toLocaleDateString("en-US")}
        </p>
        {banner.updatedAt && (
          <p>
            {t("general.others.updated")}:{" "}
            {new Date(banner.updatedAt).toLocaleDateString("en-US")}
          </p>
        )}
      </div>

      {banner?.startDate && banner.endDate && (
        <div className="text-xs text-gray-600 my-1 border-y py-3 mb-3 flex items-center gap-1">
          {banner?.startDate && (
            <p>
              {t("general.date.startDate")}:{" "}
              {new Date(banner.startDate).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
          )}

          {banner.endDate && (
            <p>
              {t("general.date.endDate")}:{" "}
              {new Date(banner.endDate).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
          )}
        </div>
      )}

      <div className="mt-auto">
        <BannersCardActions
          cardItem={banner}
          deleteFn={deleteBanner}
          unDeleteFn={unDeleteBanner}
          switchUserActiveStatusFn={switchBannerActiveStatus}
          queryKey={BANNERS_QUERY_KEY}
          showEditButton={true}
          renderEditForm={() => <EditBannerForm banner={banner} />}
        />
      </div>
    </div>
  );
};

export default memo(BannerCard);
