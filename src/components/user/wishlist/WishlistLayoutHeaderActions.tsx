"use client";

import { memo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { useAuthContext } from "@/hooks/useAuthContext";
import { showSuccessToast } from "@/components/shared/CustomToast";
import { useQueryClient } from "@tanstack/react-query";
import { PackageMinus, Box } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  removeAllWishlistItems,
  sendAllWishlistItemsToCart,
} from "@/redux/slices/wishlist/actions";

const WishlistLayoutHeaderActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { itemsCount } = useSelector((state: RootState) => state.wishlist);
  const t = useTranslations();
  const { accessToken, locale } = useAuthContext();
  const queryClient = useQueryClient();

  const [modalState, setModalState] = useState<{
    type: "delete" | "cart" | null;
    isOpen: boolean;
    error: string | null;
  }>({ type: null, isOpen: false, error: null });
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (type: "delete" | "cart") => {
    if (itemsCount === 0) return;
    setModalState({ type, isOpen: true, error: null });
  };

  const closeModal = () => {
    if (!isLoading) setModalState({ type: null, isOpen: false, error: null });
  };

  const dispatchAction = async (type: "delete" | "cart") => {
    if (type === "delete") {
      return await dispatch(
        removeAllWishlistItems({ lang: locale, token: accessToken })
      ).unwrap();
    } else {
      return await dispatch(
        sendAllWishlistItemsToCart({ lang: locale, token: accessToken })
      ).unwrap();
    }
  };

  const handleConfirm = useCallback(async () => {
    if (!modalState.type) return;
    setIsLoading(true);
    setModalState((prev) => ({ ...prev, error: null }));

    try {
      const response = await dispatchAction(modalState.type);

      if (response?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response?.message,
          dismissText: t("general.toast.dismissText"),
        });

        setModalState((prev) => ({ ...prev, isOpen: false }));

        await queryClient.invalidateQueries({
          queryKey: ["wishlistItems", ""],
        });
      }
    } catch (error) {
      setModalState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : t(
                `routes.wishlist.components.WishlistLayoutHeaderActions.${
                  modalState.type === "delete" ? "deleteError" : "wishlistError"
                }`
              ),
      }));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, modalState.type, accessToken, locale, queryClient, t]);

  const renderButton = (
    onClick: () => void,
    Icon: React.ElementType,
    labelKey: string,
    loadingLabelKey?: string,
    disabled = false
  ) => (
    <Button
      variant="default"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="inline-flex items-center gap-2 px-0 py-0 shadow-none rounded-lg text-sm font-medium duration-200 ease-in-out border border-transparent hover:text-primary-500 transition-all"
    >
      <Icon className="w-4 h-4" />
      <span>
        {isLoading && loadingLabelKey ? t(loadingLabelKey) : t(labelKey)}
      </span>
    </Button>
  );

  return (
    <>
      <div className="flex items-center gap-5">
        {renderButton(
          () => openModal("delete"),
          PackageMinus,
          "routes.wishlist.components.WishlistLayoutHeaderActions.emptyWishlist",
          "routes.wishlist.components.WishlistLayoutHeaderActions.deleting",
          itemsCount === 0
        )}

        {renderButton(
          () => openModal("cart"),
          Box,
          "routes.wishlist.components.WishlistLayoutHeaderActions.sendToCart",
          "routes.wishlist.components.WishlistLayoutHeaderActions.sendingToCart",
          itemsCount === 0
        )}
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={t(
          modalState.type === "delete"
            ? "routes.wishlist.components.WishlistLayoutHeaderActions.confirmDeleteTitle"
            : "routes.wishlist.components.WishlistLayoutHeaderActions.sendToCart"
        )}
        txt={t(
          modalState.type === "delete"
            ? "routes.wishlist.components.WishlistLayoutHeaderActions.confirmDeleteMessage"
            : "routes.wishlist.components.WishlistLayoutHeaderActions.confirmCartItemsMessage",
          { count: itemsCount }
        )}
        submitText={t(
          modalState.type === "delete"
            ? "routes.wishlist.components.WishlistLayoutHeaderActions.confirmDelete"
            : "routes.wishlist.components.WishlistLayoutHeaderActions.confirmCart"
        )}
        cancelText={t(
          "routes.wishlist.components.WishlistLayoutHeaderActions.cancel"
        )}
        variant="danger"
        onSubmit={handleConfirm}
        onCancel={closeModal}
        isLoading={isLoading}
        errMsg={modalState.error || undefined}
        showIcon={true}
        autoFocus={true}
      />
    </>
  );
};

export default memo(WishlistLayoutHeaderActions);
