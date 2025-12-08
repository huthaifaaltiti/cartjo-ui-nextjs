import { memo } from "react";
import { MessageSquare, Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProdCommentsHeaderProps {
  showRating?: boolean;
  avgRating?: number;
  ratingCount?: number;
}

const ProdCommentsHeader = ({
  showRating = false,
  avgRating,
  ratingCount,
}: ProdCommentsHeaderProps) => {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t("routes.product.components.ProdCommentsHeader.customerReviews")}
        </h3>
      </div>

      {showRating && avgRating !== undefined && ratingCount !== undefined && (
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-primary-500 text-primary-500" />
          <span className="font-semibold text-gray-900">
            {avgRating.toFixed(1)}
          </span>
          <span className="text-gray-500 text-sm">
            ({ratingCount}{" "}
            {ratingCount === 1
              ? t("routes.product.components.ProdCommentsHeader.rating")
              : t("routes.product.components.ProdCommentsHeader.ratings")}
            )
          </span>
        </div>
      )}
    </div>
  );
};

export default memo(ProdCommentsHeader);
