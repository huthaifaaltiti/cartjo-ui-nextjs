"use client";

import { memo, useCallback, useState } from "react";
import { Edit, Package, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Product } from "@/types/product.type";
import { DeletingResponse, SwitchActiveStatusResponse } from "@/types/common";
import { useProducts } from "@/contexts/Products.context";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import { useLocale, useTranslations } from "next-intl";
import { invalidateQuery } from "@/utils/queryUtils";
import { useQueryClient } from "@tanstack/react-query";

type ProductCardActionsProps = {
  setShowActions: (showActions: boolean) => void;
  product: Product;
  deleteFn: (token: string, prodId: string) => Promise<DeletingResponse>;
  unDeleteFn: (token: string, prodId: string) => Promise<DeletingResponse>;
  switchActiveStatusFn: (
    token: string,
    lang: string,
    isActive: boolean,
    id: string
  ) => Promise<SwitchActiveStatusResponse>;
};

const ProductCardActions = ({
  setShowActions,
  product,
  deleteFn,
  unDeleteFn,
  switchActiveStatusFn,
}: ProductCardActionsProps) => {
  const { token, queryKey } = useProducts();
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await deleteFn(token, product._id);
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
      const resp = await unDeleteFn(token, product._id);
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
        // Add your edit logic here
        console.log("Edit action triggered");
        setShowActions(false);
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
    <div className="absolute right-0 top-full mt-2 w-48 bg-white-50 rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="py-2 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="text-xs text-gray-500">
              {t("general.processing")}
            </div>
          </div>
        )}

        <button
          onClick={() => handleAction("edit")}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-gray-700"
        >
          <Edit size={16} />
          <span>{t("general.actions.edit", { default: "Edit Product" })}</span>
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
  );
};

export default memo(ProductCardActions);
