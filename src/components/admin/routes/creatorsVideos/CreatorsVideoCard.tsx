import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CreatorsVideo } from "@/types/creators/creatorsVideo";
import { isArabicLocale } from "@/config/locales.config";
import CreatorsVideoCardActions from "./CreatorsVideoCardActions";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";

type CreatorsVideoCardProps = {
  item: CreatorsVideo;
  queryKey: string;
};

const CreatorsVideoCard = ({
  item: video,
  queryKey,
}: CreatorsVideoCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Video Preview */}
      <div className="relative aspect-video w-full rounded overflow-hidden bg-neutral-900 border border-neutral-200">
        <video
          src={video.media.url}
          className="w-full h-full object-cover"
          muted
          controls
        />
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
          <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-blue-100 text-blue-800 uppercase">
            {video.type || CreatorsVideoType.HERO.toUpperCase()}
          </span>
          {video.isDeleted && (
            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-100 text-red-800">
              {t("general.items.states.deleted")}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
          {isArabic ? video.title.ar : video.title.en}
        </h3>
        <span className="text-[10px] text-gray-450">
          Created: {new Date(video.createdAt).toLocaleDateString()}
        </span>
      </div>

      <CreatorsVideoCardActions video={video} queryKey={queryKey} />
    </div>
  );
};

export default memo(CreatorsVideoCard);
