import { memo } from "react";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

const NoProdComments = () => {
  const t = useTranslations();

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-gray-700 mb-1">
        {t("routes.product.components.NoProdComments.noReviews")}
      </h3>
      <p className="text-gray-500 text-sm">
        {t("routes.product.components.NoProdComments.shareThoughts")}
      </p>
    </div>
  );
};

export default memo(NoProdComments);
