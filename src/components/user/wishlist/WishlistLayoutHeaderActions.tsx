"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useWishlist } from "@/contexts/Wishlist.context";
import { useAuthContext } from "@/hooks/useAuthContext";
import { showSuccessToast } from "@/components/shared/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PackageMinus, Box } from "lucide-react";

const WishlistLayoutHeaderActions: React.FC = () => {
  const router = useRouter();
  const t = useTranslations();
  const { deleteAllWishlistItems, queryKey, wishlistItemsCount } =
    useWishlist();
  const { accessToken, locale } = useAuthContext();
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSendItemsToCart = (): void => {};

  const handleDeleteClick = (): void => {
    if (wishlistItemsCount > 0) {
      setShowDeleteModal(true);
      setDeleteError(null);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await deleteAllWishlistItems(accessToken, locale);

      if (response?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response?.message,
          dismissText: t("general.toast.dismissText"),
        });

        setShowDeleteModal(false);

        router.refresh();

        await queryClient.invalidateQueries({ queryKey: [queryKey, ""] });
        await queryClient.refetchQueries({ queryKey: [queryKey, ""] });
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : t(
              "routes.wishlist.components.WishlistLayoutHeaderActions.deleteError"
            )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (): void => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setDeleteError(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-5">
        {/* Clear wishlist button */}
        <Button
          variant="default"
          onClick={handleDeleteClick}
          disabled={wishlistItemsCount === 0 || isDeleting}
          className={`inline-flex items-center gap-2 px-0 py-0 shadow-none rounded-lg text-sm font-medium duration-200 ease-in-out border border-transparent hover:text-primary-500 transition-all`}
        >
          <PackageMinus className="w-4 h-4" />

          <span>
            {isDeleting
              ? t(
                  "routes.wishlist.components.WishlistLayoutHeaderActions.deleting"
                )
              : t(
                  "routes.wishlist.components.WishlistLayoutHeaderActions.emptyWishlist"
                )}
          </span>
        </Button>

        {/* send all items to wishlist button */}
        <Button
          variant="default"
          onClick={handleSendItemsToCart}
          disabled={wishlistItemsCount === 0 || false}
          className={`inline-flex items-center gap-2 px-0 py-0 shadow-none rounded-lg text-sm font-medium duration-200 ease-in-out border border-transparent hover:text-primary-500 transition-all`}
        >
          <Box className="w-4 h-4" />

          {/* isSendingToCart */}
          <span>
            {false
              ? t(
                  "routes.wishlist.components.WishlistLayoutHeaderActions.sendingToCart"
                )
              : t(
                  "routes.wishlist.components.WishlistLayoutHeaderActions.sendToCart"
                )}
          </span>
        </Button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title={t(
          "routes.wishlist.components.WishlistLayoutHeaderActions.confirmDeleteTitle"
        )}
        txt={t(
          "routes.wishlist.components.WishlistLayoutHeaderActions.confirmDeleteMessage",
          { count: wishlistItemsCount }
        )}
        submitText={t(
          "routes.wishlist.components.WishlistLayoutHeaderActions.confirmDelete"
        )}
        cancelText={t(
          "routes.wishlist.components.WishlistLayoutHeaderActions.cancel"
        )}
        variant="danger"
        onSubmit={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        errMsg={deleteError || undefined}
        showIcon={true}
        autoFocus={true}
      />
    </>
  );
};

export default memo(WishlistLayoutHeaderActions);
