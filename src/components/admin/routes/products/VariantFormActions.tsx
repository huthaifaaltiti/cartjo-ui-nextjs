"use client";

import { memo, useCallback, useState } from "react";
import { Package, PackageOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateQuery } from "@/utils/queryUtils";
import { BaseResponse } from "@/types/service-response.type";
import { useProducts } from "@/contexts/Products.context";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { Button } from "@/components/ui/button";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";

type ProductCardActionsProps = {
  productId: string;
  variantId: string;
  isDeleted: boolean;
  isActive: boolean;
  deleteFn: (
    token: string | null,
    locale: string,
    prodId: string,
    varId: string,
  ) => Promise<BaseResponse>;
  unDeleteFn: (
    token: string | null,
    lang: string,
    prodId: string,
    varId: string,
  ) => Promise<BaseResponse>;
  switchActiveStatusFn: (
    token: string | null,
    lang: string,
    isActive: boolean,
    prodId: string,
    varId: string,
  ) => Promise<BaseResponse>;
};

const ProductCardActions = ({
  productId,
  variantId,
  isActive,
  isDeleted,
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
      const resp = await deleteFn(token, locale, productId, variantId);
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
  }, [deleteFn, token, variantId, productId, queryClient, queryKey, t]);

  const handleUnDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await unDeleteFn(token, locale, productId, variantId);
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
  }, [unDeleteFn, token, variantId, productId, queryClient, queryKey, t]);

  const handleToggleActiveStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await switchActiveStatusFn(
        token,
        locale,
        !isActive,
        productId,
        variantId,
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
    isActive,
    queryClient,
    queryKey,
    t,
    variantId,
    productId,
  ]);

  const handleAction = (
    action: "edit" | "delete" | "toggle-active" | "un-delete",
  ) => {
    switch (action) {
      case "delete":
        handleDelete();
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
      <div className="w-48">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
              <div className="text-xs text-gray-500">
                {t("general.loadingStates.loadingApi")}
              </div>
            </div>
          )}

          <div className="w-full flex items-start gap-3 p-2">
            {!isDeleted ? (
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
              value={isActive}
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
    </>
  );
};

export default memo(ProductCardActions);
