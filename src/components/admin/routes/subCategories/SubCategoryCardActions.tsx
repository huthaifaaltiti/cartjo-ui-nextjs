"use client";

import { memo, useCallback, useState } from "react";
import { Package, PackageOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { BaseResponse } from "@/types/service-response.type";
import { invalidateQuery } from "@/utils/queryUtils";
import { Button } from "@/components/ui/button";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import { Permission } from "@/enums/permission.enum";
import { usePermission } from "@/hooks/usePermission";
import { showNoPermissionToast } from "@/utils/permissionToast";

type DashboardCardActionsProps<
  T extends { _id: string; isDeleted: boolean; isActive: boolean },
> = {
  cardItem: T;
  deleteFn: (id: string) => Promise<BaseResponse>;
  unDeleteFn: (id: string) => Promise<BaseResponse>;
  switchUserActiveStatusFn: (
    lang: string,
    isActive: boolean,
    id: string,
  ) => Promise<BaseResponse>;
  queryKey: string;
  showEditButton?: boolean;
  renderEditForm?: (item: T) => React.ReactNode;
};

const CategoryCardActions = <
  T extends { _id: string; isDeleted: boolean; isActive: boolean },
>({
  cardItem,
  deleteFn,
  unDeleteFn,
  switchUserActiveStatusFn,
  queryKey,
  showEditButton = false,
  renderEditForm,
}: DashboardCardActionsProps<T>) => {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    canDeleteSubCategory,
    canRestoreSubCategory,
    canActivateSubCategory,
    canDeActivateSubCategory,
    canUpdateSubCategory,
  } = usePermission({
    canDeleteSubCategory: Permission.SUB_CATEGORIES_DELETE,
    canRestoreSubCategory: Permission.SUB_CATEGORIES_RESTORE,
    canActivateSubCategory: Permission.SUB_CATEGORIES_ACTIVATE,
    canDeActivateSubCategory: Permission.SUB_CATEGORIES_DEACTIVATE,
    canUpdateSubCategory: Permission.SUB_CATEGORIES_UPDATE,
  });

  const handleDelete = useCallback(async () => {
    if (!canDeleteSubCategory) {
      showNoPermissionToast(t);
      return;
    }
    setIsLoading(true);
    try {
      const resp = await deleteFn(cardItem._id);
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
  }, [deleteFn, cardItem._id, queryClient, queryKey, t, canDeleteSubCategory]);

  const handleUnDelete = useCallback(async () => {
    if (!canRestoreSubCategory) {
      showNoPermissionToast(t);
      return;
    }
    setIsLoading(true);
    try {
      const resp = await unDeleteFn(cardItem._id);
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
    unDeleteFn,
    cardItem._id,
    queryClient,
    queryKey,
    t,
    canRestoreSubCategory,
  ]);

  const handleToggleActiveStatus = useCallback(async () => {
    const hasAccess = cardItem?.isActive
      ? canDeActivateSubCategory
      : canActivateSubCategory;

    if (!hasAccess) {
      showNoPermissionToast(t);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await switchUserActiveStatusFn(
        locale,
        !cardItem.isActive,
        cardItem._id,
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
    switchUserActiveStatusFn,

    cardItem._id,
    cardItem.isActive,
    queryClient,
    queryKey,
    locale,
    t,
    canDeActivateSubCategory,
    canActivateSubCategory,
  ]);

  return (
    <>
      <div
        className={`w-full flex items-center gap-2 ${
          showEditButton ? "flex-wrap" : ""
        } relative`}
      >
        {isLoading && (
          <div className="w-full h-full absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md shadow-inner border border-white/40 rounded-lg">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-lg shadow-xl">
              <LoadingSpinner size="sm" color="#a29bfe" />
            </div>
          </div>
        )}

        <div className="w-1/4">
          {(canDeActivateSubCategory || canActivateSubCategory) && (
            <ToggleSwitch
              value={cardItem.isActive}
              onChange={handleToggleActiveStatus}
              width={50}
              height={22}
              trackColorInactive="#E55050"
              trackColorActive="#16610E"
              isDisabled={false}
            />
          )}
        </div>

        <div className="w-full flex items-center justify-center gap-4 flex-wrap sm:flex-nowrap">
          {!cardItem.isDeleted
            ? canDeleteSubCategory && (
                <Button
                  disabled={isLoading}
                  className={`${
                    showEditButton ? "w-full" : "w-full"
                  } min-h-3 bg-red-500 hover:bg-red-600 text-white-50 transition-all`}
                  onClick={handleDelete}
                >
                  <Package className="w-1 h-1" />
                  {t("general.actions.delete")}
                </Button>
              )
            : canRestoreSubCategory && (
                <Button
                  disabled={isLoading}
                  className={`${
                    showEditButton ? "w-full" : "w-full"
                  } min-h-3 bg-success-500 hover:bg-success-600 text-white-50 transition-all`}
                  onClick={handleUnDelete}
                >
                  <PackageOpen className="w-1 h-1" />
                  {t("general.actions.restore")}
                </Button>
              )}

          {showEditButton && canUpdateSubCategory && renderEditForm && (
            <Button
              disabled={isLoading}
              className="w-full min-h-3 bg-gray-500 hover:bg-gray-600 text-white-50 transition-all"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Package className="w-1 h-1" />
              {t("general.actions.edit")}
            </Button>
          )}
        </div>
      </div>

      {renderEditForm && canUpdateSubCategory && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          {renderEditForm(cardItem)}
        </Modal>
      )}
    </>
  );
};

export default memo(CategoryCardActions);
