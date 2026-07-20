"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Package, PackageOpen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { invalidateQuery } from "@/utils/queryUtils";
import { Button } from "@/components/ui/button";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import { UserCardProps } from "./DashboardUserCard";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/shared/Modal";
import EditAdminUserForm from "../routes/users/adminUsers/EditAdminUserForm";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";
import { showNoPermissionToast } from "@/utils/permissionToast";

type DashboardUserCardActionsProps = UserCardProps;

const DashboardUserCardActions = ({
  user,
  deleteUser,
  unDeleteUser,
  switchUserActiveStatus,
  queryKey,
}: DashboardUserCardActionsProps) => {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canShowEditButton, setCanShowEditButton] = useState<boolean>(false);
  const [isAdminEditModalOpen, setIsAdminEditModalOpen] =
    useState<boolean>(false);

  const handleOpenEditAdminModal = () => setIsAdminEditModalOpen(true);
  const handleCloseEditAdminModal = () => setIsAdminEditModalOpen(false);

  const {
    canActivateUser,
    canDeActivateUser,
    canDeleteUser,
    canRestoreUser,
    canUpdateUser,
  } = usePermission({
    canActivateUser: Permission.USERS_ACTIVATE,
    canDeActivateUser: Permission.USERS_DEACTIVATE,
    canDeleteUser: Permission.USERS_DELETE,
    canRestoreUser: Permission.USERS_RESTORE,
    canUpdateUser: Permission.USERS_UPDATE,
  });

  const handleDelete = useCallback(async () => {
    if (!canDeleteUser) {
      showNoPermissionToast(t);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await deleteUser(user._id);

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
  }, [deleteUser, queryClient, queryKey, t, user._id, canDeleteUser]);

  const handleUnDelete = useCallback(async () => {
    if (!canRestoreUser) {
      showNoPermissionToast(t);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await unDeleteUser(user._id);
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
  }, [unDeleteUser, queryClient, queryKey, t, user._id, canRestoreUser]);

  const handleSwitchUserActiveStatus = useCallback(async () => {
    const hasAccess = user?.isActive ? canDeActivateUser : canActivateUser;

    if (!hasAccess) {
      showNoPermissionToast(t);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await switchUserActiveStatus(
        locale,
        !user?.isActive,
        user._id,
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
    locale,
    queryClient,
    queryKey,
    switchUserActiveStatus,
    t,
    user._id,
    user?.isActive,
    canActivateUser,
    canDeActivateUser,
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentURL = window.location.href;

      if (currentURL.includes("admin-users") && user?.canManage) {
        setCanShowEditButton(true);
      }
    }
  }, [user?.canManage]);

  return (
    <>
      <div
        className={`w-full flex items-center gap-2 ${
          canShowEditButton ? "flex-wrap" : ""
        } relative`}
      >
        {isLoading && (
          <div className="w-full h-full absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md shadow-inner border border-white/40 rounded-lg">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-lg shadow-xl">
              <LoadingSpinner size="sm" color="#a29bfe" />
            </div>
          </div>
        )}

        {(canActivateUser || canDeActivateUser) && (
          <div className="w-1/4">
            <ToggleSwitch
              value={user?.isActive}
              onChange={handleSwitchUserActiveStatus}
              width={50}
              height={22}
              trackColorInactive="#E55050"
              trackColorActive="#16610E"
              isDisabled={false}
            />
          </div>
        )}

        <div className="w-3/4">
          {!user?.isDeleted
            ? canDeleteUser && (
                <Button
                  disabled={isLoading}
                  className={`${
                    canShowEditButton ? "min-w-40 w-auto" : "w-full"
                  } min-h-3 bg-red-500 hover:bg-red-600 text-white-50 transition-all`}
                  onClick={handleDelete}
                >
                  <Package className="w-1 h-1" />
                  {t(
                    "routes.dashboard.routes.users.routes.totalUsers.components.UserCardActions.archiveUser",
                  )}
                </Button>
              )
            : canRestoreUser && (
                <Button
                  disabled={isLoading}
                  className={`${
                    canShowEditButton ? "min-w-40 w-auto" : ""
                  } min-h-3 bg-success-500 hover:bg-success-600 text-white-50 transition-all`}
                  onClick={handleUnDelete}
                >
                  <PackageOpen />
                  {t(
                    "routes.dashboard.routes.users.routes.totalUsers.components.UserCardActions.restoreUser",
                  )}
                </Button>
              )}
        </div>

        {canShowEditButton && canUpdateUser && (
          <Button
            disabled={isLoading}
            className="min-w-40 w-auto min-h-3 bg-red-500 hover:bg-red-600 text-white-50 transition-all"
            onClick={handleOpenEditAdminModal}
          >
            <Package className="w-1 h-1" />
            {t(
              "routes.dashboard.routes.users.components.DashboardUserCardActions.editAdminDetails",
            )}
          </Button>
        )}
      </div>

      {canShowEditButton && canUpdateUser && (
        <Modal
          isOpen={isAdminEditModalOpen}
          onClose={handleCloseEditAdminModal}
        >
          <EditAdminUserForm user={user} />
        </Modal>
      )}
    </>
  );
};

export default memo(DashboardUserCardActions);
