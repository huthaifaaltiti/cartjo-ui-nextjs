import { memo } from "react";
import { useTranslations } from "next-intl";
import LoadingDots from "./LoadingDots";

const RequestingDataLoader = () => {
  const t = useTranslations();

  return (
    <div className="w-full flex items-center gap-3">
      <span className="text-xs text-text-primary-300">
        {t("general.loadingStates.requestingData")}
      </span>{" "}
      <LoadingDots />
    </div>
  );
};

export default memo(RequestingDataLoader);
