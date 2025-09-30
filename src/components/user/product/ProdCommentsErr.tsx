import { memo } from "react";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

const ProdCommentsErr = ({ msg }: { msg: string }) => {
  const t = useTranslations();

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <MessageSquare className="w-12 h-12 text-red-400 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-red-900 mb-1">
        {t("routes.product.components.ProdCommentsErr.failedLoadComments")}
      </h3>
      <p className="text-red-600 text-sm">{msg || "Something went wrong"}</p>
    </div>
  );
};

export default memo(ProdCommentsErr);
