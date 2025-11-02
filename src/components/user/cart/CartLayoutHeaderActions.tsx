"use client";

import { memo, useState, useCallback } from "react";
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
  removeAllItemsFromServer,
  wishlistItems,
} from "@/redux/slices/cart/actions";

const CartLayoutHeaderActions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { itemsCount } = useSelector((state: RootState) => state.cart);
  const t = useTranslations();
  const { accessToken, locale } = useAuthContext();
  const queryClient = useQueryClient();

  const [modalState, setModalState] = useState<{
    type: "delete" | "wishlist" | null;
    isOpen: boolean;
    error: string | null;
  }>({ type: null, isOpen: false, error: null });

  const [isLoading, setIsLoading] = useState(false);

  const openModal = (type: "delete" | "wishlist") => {
    if (itemsCount === 0) return;
    setModalState({ type, isOpen: true, error: null });
  };

  const closeModal = () => {
    if (!isLoading) setModalState({ type: null, isOpen: false, error: null });
  };

  const dispatchAction = async (type: "delete" | "wishlist") => {
    if (type === "delete") {
      return await dispatch(
        removeAllItemsFromServer({ lang: locale, token: accessToken })
      ).unwrap();
    } else {
      return await dispatch(
        wishlistItems({ lang: locale, token: accessToken })
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
        await queryClient.invalidateQueries({ queryKey: ["cartItems", ""] });
        await queryClient.refetchQueries({ queryKey: ["cartItems", ""] });
      }
    } catch (error) {
      setModalState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : t(
                `routes.cart.components.CartLayoutHeaderActions.${
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
          "routes.cart.components.CartLayoutHeaderActions.emptyCart",
          "routes.cart.components.CartLayoutHeaderActions.deleting",
          itemsCount === 0
        )}

        {renderButton(
          () => openModal("wishlist"),
          Box,
          "routes.cart.components.CartLayoutHeaderActions.sendToCart",
          "routes.cart.components.CartLayoutHeaderActions.sendingToCart",
          itemsCount === 0
        )}
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={t(
          modalState.type === "delete"
            ? "routes.cart.components.CartLayoutHeaderActions.confirmDeleteTitle"
            : "routes.cart.components.CartLayoutHeaderActions.confirmWishlistItemsTitle"
        )}
        txt={t(
          modalState.type === "delete"
            ? "routes.cart.components.CartLayoutHeaderActions.confirmDeleteMessage"
            : "routes.cart.components.CartLayoutHeaderActions.confirmWishlistItemsMessage",
          { count: itemsCount }
        )}
        submitText={t(
          modalState.type === "delete"
            ? "routes.cart.components.CartLayoutHeaderActions.confirmDelete"
            : "routes.cart.components.CartLayoutHeaderActions.confirmWishlist"
        )}
        cancelText={t("routes.cart.components.CartLayoutHeaderActions.cancel")}
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

export default memo(CartLayoutHeaderActions);
