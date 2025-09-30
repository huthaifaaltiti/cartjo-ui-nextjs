import { memo } from "react";
import { Comment } from "@/types/comment.type";
import { Clock, Edit2, Star } from "lucide-react";
import { formatRelativeDate } from "@/utils/formatDate";
import UserAvatarByName from "@/components/shared/UserAvatarByName";
import { useTranslations } from "next-intl";
import { UserRole } from "@/enums/user-role.enum";
import AdminBadge from "@/components/shared/AdminBadge";

const StarRating = ({ rating }: { rating: number | null }) => {
  if (rating === null) return null;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-primary-500 text-primary-500"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ProductCommentCard = ({ item: comment }: { item: Comment }) => {
  const t = useTranslations();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <UserAvatarByName
            firstName={comment?.userId?.firstName!}
            lastName={comment?.userId?.lastName!}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-900">
                {comment?.userId?.firstName} {comment?.userId?.lastName}
              </h4>

              {(comment?.userId?.role === UserRole.ADMINISTRATOR ||
                comment?.userId?.role === UserRole.OWNER) && (
                <AdminBadge
                  label={t("general.account.status.verifiedAccount")}
                  size="xs"
                />
              )}

              {comment.isPurchasedProduct && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {t(
                    "routes.product.components.ProductCommentCard.verifiedPurchase"
                  )}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatRelativeDate(comment?.createdAt)}</span>
              </div>
              {comment.isUpdated && (
                <div className="flex items-center gap-1 text-orange-600">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{t("general.others.edited")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <StarRating rating={comment.rating} />
      </div>

      <p className="text-gray-700 leading-relaxed ml-13">{comment.content}</p>
    </div>
  );
};

export default memo(ProductCommentCard);
