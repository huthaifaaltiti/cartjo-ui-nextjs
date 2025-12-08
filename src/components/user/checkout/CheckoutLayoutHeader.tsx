import { memo } from "react";
import { useTranslations } from "next-intl";

const CheckoutLayoutHeader = () => {
  const t = useTranslations();

  return (
    <div className="w-full flex items-center justify-between gap-5 py-3">
      <h1 className="text-3xl text-text-primary-400 font-bold">
        {t("routes.checkout.header")}
      </h1>
    </div>
  );
};

export default memo(CheckoutLayoutHeader);
