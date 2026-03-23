import { useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePublicProductContext } from "@/contexts/PublicProduct.context";
import {
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validationConfig } from "@/config/validationConfig";
import { containsArabic } from "@/utils/text/containsArabic";

interface AddCommentProps {
  productId: string;
  refetch: () => void;
}

const formSchema = (
  t: (key: string, values?: Record<string, number>) => string,
) =>
  z.object({
    comment: z
      .string()
      .trim()
      .min(1, t("routes.product.components.AddComment.enterComment"))
      .min(
        validationConfig.product.comment.commentMinChars,
        t("routes.product.components.AddComment.commentMinChars", {
          min: validationConfig.product.comment.commentMinChars,
        }),
      )
      .max(
        validationConfig.product.comment.commentMaxChars,
        t("routes.product.components.AddComment.commentMaxChars", {
          max: validationConfig.product.comment.commentMaxChars,
        }),
      ),

    rating: z
      .number()
      .min(
        validationConfig.product.comment.ratingMin,
        t("routes.product.components.AddComment.ratingMin", {
          min: validationConfig.product.comment.ratingMin,
        }),
      )
      .max(
        validationConfig.product.comment.ratingMax,
        t("routes.product.components.AddComment.ratingMax", {
          max: validationConfig.product.comment.ratingMax,
        }),
      ),
  });

const AddComment = ({ productId, refetch }: AddCommentProps) => {
  const t = useTranslations();
  const { addComment } = usePublicProductContext();
  const { selectedVariant } = useSelector((state: RootState) => state.product);
  const { requireAuth } = useRequireAuth();

  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      comment: "",
      rating: 0,
    },
  });

  const rating = form.watch("rating");
  const comment = form.watch("comment");

  const onSubmit = async (values: FormValues) => {
    if (!requireAuth()) return;

    console.log("requireAuth()", requireAuth());

    if (!productId || !selectedVariant?.variantId) {
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t("components.ProductVertCard.selectVariant"),
        dismissText: t("general.toast.dismissText"),
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await addComment(
        productId,
        selectedVariant.variantId,
        values.comment,
        values.rating,
      );

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });

        form.reset();
        refetch();
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
          description: response.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (error) {
      console.log({ error });
      showWarningToast({
        title: t("general.toast.title.warning"),
        description: t(
          "routes.product.components.AddComment.submitCommentFailed",
        ),
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-md font-semibold text-gray-900 mb-4">
        {t("routes.product.components.AddComment.writeReview")}
      </h3>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            {t("routes.product.components.AddComment.yourRating")}
          </label>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => form.setValue("rating", star)}
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
                  }`}
                />
              </button>
            ))}
          </div>

          {form.formState.errors.rating && (
            <p className="text-xs text-red-500 mt-1">
              {form.formState.errors.rating.message}
            </p>
          )}

          {rating > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              {rating}{" "}
              {rating === 1
                ? t("general.others.star")
                : t("general.others.stars")}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-xs font-medium text-gray-700 mb-2"
          >
            {t("routes.product.components.AddComment.yourComment")}
          </label>

          <textarea
            id="comment"
            {...form.register("comment")}
            placeholder={t(
              "routes.product.components.AddComment.shareThoughts",
            )}
            rows={4}
            disabled={isSubmitting}
            dir={containsArabic(comment) ? "rtl" : "ltr"}
            className={`w-full text-sm px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed ${containsArabic(comment) ? "font-[var(--font-noto-kufi)] text-right" : "font-sans text-left"}`}
            maxLength={validationConfig.product.comment.commentMaxChars}
          />

          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              ({comment?.length || 0}/
              {validationConfig.product.comment.commentMaxChars}){" "}
              {t("general.others.characters")}
            </p>
          </div>

          {form.formState.errors.comment && (
            <p className="text-xs text-red-500 mt-1">
              {form.formState.errors.comment.message}
            </p>
          )}
        </div>

        {/* Submit */}
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
