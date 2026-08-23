"use client";

import { memo, useCallback, useState } from "react";
import { Package, PackageOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/shared/CustomToast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import EditCreatorsVideoForm from "./EditCreatorsVideoForm";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { authFetcher } from "@/utils/authFetcher";
import { Permission } from "@/enums/permission.enum";
import { usePermission } from "@/hooks/usePermission";
import { showNoPermissionToast } from "@/utils/permissionToast";
import { invalidateQuery } from "@/utils/queryUtils";
import { CreatorsVideo } from "@/types/creatorsVideo";
import { Locale } from "@/types/locale";

type CreatorsVideoCardActionsProps = {
  video: CreatorsVideo;
  queryKey: string;
  showEditButton?: boolean;
};

const CreatorsVideoCardActions = ({
  video,
  queryKey,
  showEditButton = true,
}: CreatorsVideoCardActionsProps) => {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { canDelete, canRestore, canActivate, canDeactivate, canUpdate } =
    usePermission({
      canDelete: Permission.CREATORS_VIDEOS_DELETE,
      canRestore: Permission.CREATORS_VIDEOS_RESTORE,
      canActivate: Permission.CREATORS_VIDEOS_ACTIVATE,
      canDeactivate: Permission.CREATORS_VIDEOS_DEACTIVATE,
      canUpdate: Permission.CREATORS_VIDEOS_UPDATE,
    });

  const handleDelete = useCallback(async () => {
    if (!canDelete) {
      showNoPermissionToast(t);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await authFetcher<any>(
        `${API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.DELETE}/${video._id}?lang=${locale}`,
        { method: "DELETE" },
      );

      if (resp?.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
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
  }, [canDelete, video._id, locale, queryClient, queryKey, t]);

  const handleRestore = useCallback(async () => {
    if (!canRestore) {
      showNoPermissionToast(t);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await authFetcher<any>(
        `${API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.UN_DELETE}/${video._id}?lang=${locale}`,
        { method: "PUT" },
      );

      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
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
  }, [canRestore, video._id, locale, queryClient, queryKey, t]);

  const handleToggleActiveStatus = useCallback(async () => {
    const hasAccess = video.isActive ? canDeactivate : canActivate;

    if (!hasAccess) {
      showNoPermissionToast(t);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await authFetcher<any>(
        `${API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.SWITCH_ACTIVE_STATUS}/${video._id}?lang=${locale}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !video.isActive }),
        },
      );
      if (resp.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: resp.message,
          dismissText: t("general.toast.dismissText"),
        });
      } else {
        showWarningToast({
          title: t("general.toast.title.warning"),
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
    video._id,
    video.isActive,
    canActivate,
    canDeactivate,
    locale,
    queryClient,
    queryKey,
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
          {(canActivate || canDeactivate) && (
            <ToggleSwitch
              value={video.isActive}
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
          {!video.isDeleted
            ? canDelete && (
                <Button
                  disabled={isLoading}
                  className="w-full min-h-3 bg-red-500 hover:bg-red-600 text-white-50 transition-all flex items-center justify-center gap-1.5"
                  onClick={handleDelete}
                >
                  <Package className="w-4 h-4" />
                  <span>{t("general.actions.delete")}</span>
                </Button>
              )
            : canRestore && (
                <Button
                  disabled={isLoading}
                  className="w-full min-h-3 bg-success-500 hover:bg-success-600 text-white-50 transition-all flex items-center justify-center gap-1.5"
                  onClick={handleRestore}
                >
                  <PackageOpen className="w-4 h-4" />
                  <span>{t("general.actions.restore")}</span>
                </Button>
              )}

          {canUpdate && showEditButton && (
            <Button
              disabled={isLoading}
              className="w-full min-h-3 bg-gray-500 hover:bg-gray-600 text-white-50 transition-all flex items-center justify-center gap-1.5"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Package className="w-4 h-4" />
              <span>{t("general.actions.edit")}</span>
            </Button>
          )}
        </div>
      </div>

      {canUpdate && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <EditCreatorsVideoForm
            video={video}
            onSuccess={() => setIsEditModalOpen(false)}
            queryKey={queryKey}
          />
        </Modal>
      )}
    </>
  );
};

export default memo(CreatorsVideoCardActions);
