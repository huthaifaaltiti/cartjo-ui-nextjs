"use client";

import { memo, useCallback, useState } from "react";
import { Package, PackageOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateQuery } from "@/utils/queryUtils";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { Button } from "@/components/ui/button";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import { useHomeEffectsContext } from "@/contexts/HomeEffectsContext";

type DashboardCardActionsProps<
  T extends { _id: string; isDeleted: boolean; isActive: boolean }
> = {
  cardItem: T;
  deleteFn: (
    token: string | null,
    id: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  unDeleteFn: (
    token: string | null,
    id: string,
    lang: Locale
  ) => Promise<BaseResponse>;
  switchUserActiveStatusFn: (
    token: string | null,
    lang: string,
    isActive: boolean,
    id: string
  ) => Promise<BaseResponse>;
  accessToken: string | null;
  queryKey: string;
  showEditButton?: boolean;
  renderEditForm?: (item: T) => React.ReactNode;
};

const BannersCardActions = <
  T extends { _id: string; isDeleted: boolean; isActive: boolean }
>({
  cardItem,
  deleteFn,
  unDeleteFn,
  switchUserActiveStatusFn,
  accessToken,
  queryKey,
  showEditButton = false,
  renderEditForm,
}: DashboardCardActionsProps<T>) => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const queryClient = useQueryClient();
  const { setChangeBanners } = useHomeEffectsContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await deleteFn(accessToken, cardItem._id, locale);
      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });

        setChangeBanners(true);
      } else {
        showWarningToast({
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
  }, [deleteFn, accessToken, cardItem._id, queryClient, queryKey, t]);

  const handleUnDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await unDeleteFn(accessToken, cardItem._id, locale);

      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.warning"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });

        setChangeBanners(true);
      } else {
        showWarningToast({
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
  }, [unDeleteFn, accessToken, cardItem._id, queryClient, queryKey, t]);

  const handleToggleActiveStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await switchUserActiveStatusFn(
        accessToken,
        locale,
        !cardItem.isActive,
        cardItem._id
      );
      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });

        setChangeBanners(true);
      } else {
        showWarningToast({
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
    accessToken,
    cardItem._id,
    cardItem.isActive,
    queryClient,
    queryKey,
    locale,
    t,
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
          <ToggleSwitch
            value={cardItem.isActive}
            onChange={handleToggleActiveStatus}
            width={50}
            height={22}
            trackColorInactive="#E55050"
            trackColorActive="#16610E"
            isDisabled={false}
          />
        </div>

        <div className="w-full flex items-center justify-center gap-4 flex-wrap sm:flex-nowrap">
          {!cardItem.isDeleted ? (
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
          ) : (
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

          {showEditButton && renderEditForm && (
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

      {renderEditForm && (
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

export default memo(BannersCardActions);
