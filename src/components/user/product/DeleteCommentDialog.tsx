import { AlertTriangle, X } from "lucide-react";
import { useTranslations } from "next-intl";

type DeleteCommentDialogProps = {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteCommentDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteCommentDialogProps) => {
  const t = useTranslations();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("routes.product.components.DeleteCommentDialog.title")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("routes.product.components.DeleteCommentDialog.description")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {t("general.actions.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isDeleting
              ? t("general.actions.deleting")
              : t("general.actions.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentDialog;
