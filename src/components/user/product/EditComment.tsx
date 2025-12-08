import { useState } from "react";
import { Check, X, Star } from "lucide-react";
import { useTranslations } from "next-intl";

type EditCommentFormProps = {
  initialContent: string;
  initialRating: number | null;
  isSubmitting: boolean;
  onSave: (content: string, rating: number | null) => void;
  onCancel: () => void;
};

const StarRating = ({
  rating,
  onRatingChange,
}: {
  rating: number | null;
  onRatingChange: (rating: number) => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= (rating || 0)
              ? "fill-primary-500 text-primary-500"
              : "text-gray-300"
          } cursor-pointer hover:scale-110 transition-transform`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

const EditComment = ({
  initialContent,
  initialRating,
  isSubmitting,
  onSave,
  onCancel,
}: EditCommentFormProps) => {
  const t = useTranslations();
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);

  const handleSave = () => {
    if (!content.trim()) {
      return;
    }
    onSave(content.trim(), rating);
  };

  return (
    <div className="ml-13 space-y-3">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-gray-600">
          {t("routes.product.components.EditComment.rating")}:
        </span>
        <StarRating rating={rating} onRatingChange={setRating} />
        {rating && (
          <button
            onClick={() => setRating(null)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            {t("routes.product.components.EditComment.clearRating")}
          </button>
        )}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
        rows={3}
        placeholder={t("routes.product.components.EditComment.editPlaceholder")}
        disabled={isSubmitting}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={isSubmitting || !content.trim()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white-50 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          {isSubmitting
            ? t("general.actions.saving")
            : t("general.actions.save")}
        </button>

        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <X className="w-4 h-4" />
          {t("general.actions.cancel")}
        </button>
      </div>
    </div>
  );
};

export default EditComment;
