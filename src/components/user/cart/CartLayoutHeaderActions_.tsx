"use client";

import { memo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useAuthContext } from "@/hooks/useAuthContext";
import { showSuccessToast } from "@/components/shared/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import { PackageMinus, Box } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { removeAllItemsFromServer, wishlistItems } from "@/redux/slices/cart/actions";

const CartLayoutHeaderActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { itemsCount } = useSelector((state: RootState) => state.cart);
  const t = useTranslations();
  const { accessToken, locale } = useAuthContext();
  const queryClient = useQueryClient();

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showWishlistModal, setShowWishlistModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleWishlistItems = (): void => {
    if (itemsCount > 0) {
      setShowWishlistModal(true);
      setDeleteError(null);
    }
  };

  const handleConfirmWishlistItems = async (): Promise<void> => {
    setIsLoading(true);
    setDeleteError(null);

    try {
      const response = await dispatch(
        wishlistItems({
          lang: locale,
          token: accessToken,
        })
      ).unwrap();

      if (response?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response?.message,
          dismissText: t("general.toast.dismissText"),
        });

        setShowWishlistModal(false);

        await queryClient.invalidateQueries({ queryKey: ["cartItems", ""] });
        await queryClient.refetchQueries({ queryKey: ["cartItems", ""] });
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : t("routes.cart.components.CartLayoutHeaderActions.deleteError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelWishlistItems = (): void => {
    if (!isLoading) {
      setShowWishlistModal(false);
      setDeleteError(null);
    }
  };

  const handleDeleteClick = (): void => {
    if (itemsCount > 0) {
      setShowDeleteModal(true);
      setDeleteError(null);
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    setIsLoading(true);
    setDeleteError(null);

    try {
      const response = await dispatch(
        removeAllItemsFromServer({
          lang: locale,
          token: accessToken,
        })
      ).unwrap();

      if (response?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response?.message,
          dismissText: t("general.toast.dismissText"),
        });

        setShowDeleteModal(false);

        await queryClient.invalidateQueries({ queryKey: ["cartItems", ""] });
        await queryClient.refetchQueries({ queryKey: ["cartItems", ""] });
      }
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : t("routes.cart.components.CartLayoutHeaderActions.deleteError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = (): void => {
    if (!isLoading) {
      setShowDeleteModal(false);
      setDeleteError(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-5">
        <Button
          variant="default"
          onClick={handleDeleteClick}
          disabled={itemsCount === 0 || isLoading}
          className={`inline-flex items-center gap-2 px-0 py-0 shadow-none rounded-lg text-sm font-medium duration-200 ease-in-out border border-transparent hover:text-primary-500 transition-all`}
        >
          <PackageMinus className="w-4 h-4" />

          <span>
            {isLoading
              ? t("routes.cart.components.CartLayoutHeaderActions.deleting")
              : t("routes.cart.components.CartLayoutHeaderActions.emptyCart")}
          </span>
        </Button>

        <Button
          variant="default"
          onClick={handleWishlistItems}
          disabled={itemsCount === 0 || false}
          className={`inline-flex items-center gap-2 px-0 py-0 shadow-none rounded-lg text-sm font-medium duration-200 ease-in-out border border-transparent hover:text-primary-500 transition-all`}
        >
          <Box className="w-4 h-4" />

          <span>
            {false
              ? t(
                  "routes.cart.components.CartLayoutHeaderActions.sendingToCart"
                )
              : t("routes.cart.components.CartLayoutHeaderActions.sendToCart")}
          </span>
        </Button>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title={t(
          "routes.cart.components.CartLayoutHeaderActions.confirmDeleteTitle"
        )}
        txt={t(
          "routes.cart.components.CartLayoutHeaderActions.confirmDeleteMessage",
          { count: itemsCount }
        )}
        submitText={t(
          "routes.cart.components.CartLayoutHeaderActions.confirmDelete"
        )}
        cancelText={t("routes.cart.components.CartLayoutHeaderActions.cancel")}
        variant="danger"
        onSubmit={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
        errMsg={deleteError || undefined}
        showIcon={true}
        autoFocus={true}
      />

      <ConfirmationModal
        isOpen={showWishlistModal}
        title={t(
          "routes.cart.components.CartLayoutHeaderActions.confirmWishlistItemsTitle"
        )}
        txt={t(
          "routes.cart.components.CartLayoutHeaderActions.confirmWishlistItemsMessage",
          { count: itemsCount }
        )}
        submitText={t(
          "routes.cart.components.CartLayoutHeaderActions.confirmWishlist"
        )}
        cancelText={t("routes.cart.components.CartLayoutHeaderActions.cancel")}
        variant="danger"
        onSubmit={handleConfirmWishlistItems}
        onCancel={handleCancelWishlistItems}
        isLoading={isLoading}
        errMsg={deleteError || undefined}
        showIcon={true}
        autoFocus={true}
      />
    </>
  );
};

export default memo(CartLayoutHeaderActions);
