import { useTranslations } from "next-intl";

const TopBarDeliveryMessage: React.FC = () => {
  const t = useTranslations("components.TopBarDeliveryMessage");

  return (
    <p className="hidden sm:block text-sm text-text-primary-100">
      {t("deliver")}
      <span className="text-text-tertiary-400 font-bold">
        {" "}
        {t("fromTo", {
          fromTime: "7:00",
          toTime: "23:00",
        })}
      </span>
    </p>
  );
};

export default TopBarDeliveryMessage;
