import { memo, useState } from "react";
import { Comment } from "@/types/comment.type";
import { Clock, Edit2, Star, Trash2 } from "lucide-react";
import { formatRelativeDate } from "@/utils/formatDate";
import UserAvatarByName from "@/components/shared/UserAvatarByName";
import { useTranslations } from "next-intl";
import { UserRole } from "@/enums/user-role.enum";
import AdminBadge from "@/components/shared/AdminBadge";
import { usePublicProductContext } from "@/contexts/PublicProduct.context";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/types/session";
import ProductAddCommentLoading from "./ProductAddCommentLoading";
import EditComment from "./EditComment";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import ConfirmationModal from "@/components/shared/ConfirmationModal";

const StarRating = ({
  rating,
  editable = false,
  onRatingChange,
}: {
  rating: number | null;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
}) => {
  if (rating === null && !editable) return null;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= (rating || 0)
              ? "fill-primary-500 text-primary-500"
              : "text-gray-300"
          } ${
            editable
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
          onClick={() => editable && onRatingChange?.(star)}
        />
      ))}
    </div>
  );
};

const ProductCommentCard = ({
  item: comment,
  refetch,
}: {
  item: Comment;
  refetch: () => void;
}) => {
  const t = useTranslations();
  const { data: sessionData, status } = useSession();
  const session = sessionData as ExtendedSession | null;
  const user = session?.user;

  const isOwnComment = user?.id === comment?.userId?._id;

  const { updateComment, deleteComment } = usePublicProductContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(comment.rating);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditRating(comment.rating);
  };

  const handleSaveEdit = async (content: string, rating: number | null) => {
    if (!content.trim()) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t(
          "routes.product.components.ProductCommentCard.contentRequired"
        ),
        dismissText: t("general.toast.dismissText"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateComment(
        comment?._id,
        content.trim(),
        rating || undefined
      );

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsEditing(false);
        refetch();
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast({
          title: t("general.toast.title.error"),
          description: error?.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await deleteComment(comment?._id);

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });

        setIsDeleteDialogOpen(false);
        refetch();
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast({
          title: t("general.toast.title.error"),
          description: error?.message,
          dismissText: t("general.toast.dismissText"),
        });

        setDeleteError(
          error instanceof Error
            ? error.message
            : t("routes.product.components.ProductCommentCard.deleteError")
        );
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading") {
    return <ProductAddCommentLoading />;
  }

  return (
    <div className="bg-white-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <UserAvatarByName
            firstName={comment?.userId?.firstName ?? ""}
            lastName={comment?.userId?.lastName ?? ""}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-gray-900">
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
              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeDate(comment?.createdAt)}</span>
              </div>
              {comment.isUpdated && (
                <div className="flex items-center gap-1 text-orange-600 text-xs">
                  <Edit2 className="w-3 h-3" />
                  <span>{t("general.others.edited")}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <StarRating
              rating={editRating}
              editable={true}
              onRatingChange={setEditRating}
            />
          ) : (
            <StarRating rating={comment.rating} />
          )}

          {isOwnComment && !isEditing && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-gray-100 rounded-md transition-colors"
                title={t("general.actions.edit")}
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title={t("general.actions.delete")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <EditComment
          initialContent={comment.content}
          initialRating={comment.rating}
          isSubmitting={isSubmitting}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed ml-13">
          {comment.content}
        </p>
      )}

      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        title={t(
          "routes.product.components.ProductCommentCard.confirmDeleteTitle"
        )}
        txt={t(
          "routes.product.components.ProductCommentCard.confirmDeleteMessage"
        )}
        submitText={t(
          "routes.product.components.ProductCommentCard.confirmDelete"
        )}
        cancelText={t("routes.product.components.ProductCommentCard.cancel")}
        variant="danger"
        onSubmit={handleDeleteComment}
        onCancel={() => setIsDeleteDialogOpen(false)}
        isLoading={isDeleting}
        errMsg={deleteError || undefined}
        showIcon={true}
        autoFocus={true}
      />
    </div>
  );
};

export default memo(ProductCommentCard);
