import { memo } from "react";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";

const NoOrderDetailedCardData = () => {
  const t = useTranslations();

  return (
    <div className="text-center">
      <Package className="mx-auto h-16 w-16 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {t("general.others.notFound") || "Order Not Found"}
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        {t(
          "routes.dashboard.routes.orders.components.OrderDetailedCard.notFound"
        )}
      </p>
    </div>
  );
};

export default memo(NoOrderDetailedCardData);
