"use client";

import { memo, useCallback, useState } from "react";
import { Edit, Package, PackageOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import { invalidateQuery } from "@/utils/queryUtils";

import { Product } from "@/types/product.type";
import { BaseResponse } from "@/types/service-response.type";

import { useProducts } from "@/contexts/Products.context";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";

type ProductCardActionsProps = {
  setShowActions: (showActions: boolean) => void;
  product: Product;
  deleteFn: (
    token: string,
    lang: string,
    prodId: string
  ) => Promise<BaseResponse>;
  unDeleteFn: (
    token: string,
    lang: string,
    prodId: string
  ) => Promise<BaseResponse>;
  switchActiveStatusFn: (
    token: string,
    lang: string,
    isActive: boolean,
    id: string
  ) => Promise<BaseResponse>;
  renderEditForm?: (item: Product) => React.ReactNode;
};

const ProductCardActions = ({
  setShowActions,
  product,
  deleteFn,
  unDeleteFn,
  switchActiveStatusFn,
  renderEditForm,
}: ProductCardActionsProps) => {
  const { token, queryKey } = useProducts();
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await deleteFn(token, locale, product._id);
      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (err) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (err as Error)?.message,
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsLoading(false);
      await invalidateQuery(queryClient, queryKey);
    }
  }, [deleteFn, token, product._id, queryClient, queryKey, t]);

  const handleUnDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await unDeleteFn(token, locale, product._id);
      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (err) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (err as Error)?.message,
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsLoading(false);
      await invalidateQuery(queryClient, queryKey);
    }
  }, [unDeleteFn, token, product._id, queryClient, queryKey, t]);

  const handleToggleActiveStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await switchActiveStatusFn(
        token,
        locale,
        !product.isActive,
        product._id
      );
      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } catch (err) {
      showErrorToast({
        title: t("general.toast.title.error"),
        description: (err as Error)?.message,
        dismissText: t("general.toast.dismissText"),
      });
    } finally {
      setIsLoading(false);
      await invalidateQuery(queryClient, queryKey);
    }
  }, [
    switchActiveStatusFn,
    token,
    locale,
    product._id,
    product.isActive,
    queryClient,
    queryKey,
    t,
  ]);

  const handleAction = (
    action: "edit" | "delete" | "toggle-active" | "un-delete"
  ) => {
    switch (action) {
      case "edit":
        setIsEditModalOpen(true);
        break;
      case "delete":
        handleDelete();
        setShowActions(false);
        break;
      case "un-delete":
        handleUnDelete();
        break;
      case "toggle-active":
        handleToggleActiveStatus();
        break;
    }
  };

  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-48 bg-white-50 rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="py-2 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="text-xs text-gray-500">
                {t("general.loadingStates.loadingApi")}
              </div>
            </div>
          )}

          <button
            onClick={() => handleAction("edit")}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-1 text-gray-700"
          >
            <Edit size={16} />
            <span>
              {t("general.actions.edit", { default: "Edit Product" })}
            </span>
          </button>

          <div className="border-t border-gray-100 my-1" />

          <div className="w-full flex items-start gap-3 p-2">
            {!product.isDeleted ? (
              <Button
                disabled={isLoading}
                className={`w-auto min-h-3 bg-red-500 hover:bg-red-600 text-white-50 transition-all`}
                onClick={() => handleAction("delete")}
              >
                <Package className="w-1 h-1" />
                {t("general.actions.delete")}
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                className={`w-auto min-h-3 bg-success-500 hover:bg-success-600 text-white-50 transition-all`}
                onClick={() => handleAction("un-delete")}
              >
                <PackageOpen className="w-1 h-1" />
                {t("general.actions.restore")}
              </Button>
            )}

            <ToggleSwitch
              value={product.isActive}
              onChange={handleToggleActiveStatus}
              width={50}
              height={22}
              trackColorInactive="#E55050"
              trackColorActive="#16610E"
              isDisabled={false}
            />
          </div>
        </div>
      </div>

      {renderEditForm && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          {renderEditForm(product)}
        </Modal>
      )}
    </>
  );
};

export default memo(ProductCardActions);
