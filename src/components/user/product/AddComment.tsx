import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePublicProductContext } from "@/contexts/PublicProduct.context";
import {
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";

interface AddCommentProps {
  productId: string;
  refetch: () => void;
}

const AddComment = ({ productId, refetch }: AddCommentProps) => {
  const t = useTranslations();
  const { addComment } = usePublicProductContext();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError(t("routes.product.components.AddComment.enterComment"));
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await addComment(productId, comment, rating);

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });

        setComment("");
        setRating(0);
        setHoverRating(0);

        refetch();
      } else {
        showWarningToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("routes.product.components.AddComment.submitCommentFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-md font-semibold text-gray-900 mb-4">
        {t("routes.product.components.AddComment.writeReview")}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            {t("routes.product.components.AddComment.yourRating")}
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
                disabled={isSubmitting}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= (hoverRating || rating)
                      ? "fill-primary-400 text-primary-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {rating}{" "}
              {rating === 1
                ? t("general.others.star")
                : t("general.others.stars")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-xs font-medium text-gray-700 mb-2"
          >
            {t("routes.product.components.AddComment.yourComment")}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t(
              "routes.product.components.AddComment.shareThoughts"
            )}
            rows={4}
            disabled={isSubmitting}
            className="w-full text-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            maxLength={1000}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              ({comment.length}/1000) {t("general.others.characters")}
            </p>
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-500 border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-xs bg-primary-500 text-white-50 shadow-none font-medium rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? t("routes.product.components.AddComment.submitting")
              : t("routes.product.components.AddComment.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddComment;
