"use client";

import { memo, useState } from "react";
import { Package, PackageOpen } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";

import { useTotalUsers } from "@/contexts/TotalUsersContext";
import { invalidateQuery } from "@/utils/queryUtils";

import { User } from "@/types/user";

import { Button } from "@/components/ui/button";
import ToggleSwitch from "@/components/shared/ToggleSwitch";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const UserCardActions = ({ user }: { user: User }) => {
  const { deleteUser, unDeleteUser, accessToken, switchUserActiveStatus } =
    useTotalUsers();
  const queryClient = useQueryClient();
  const t = useTranslations();
  const locale = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const resp = await deleteUser(accessToken, user._id);

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
      await invalidateQuery(queryClient, "totalUsers");
    }
  };

  const handleUnDelete = async () => {
    setIsLoading(true);
    try {
      const resp = await unDeleteUser(accessToken, user._id);

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
      await invalidateQuery(queryClient, "totalUsers");
    }
  };

  const handleSwitchUserActiveStatus = async () => {
    setIsLoading(true);
    try {
      const resp = await switchUserActiveStatus(
        accessToken,
        locale,
        !user?.isActive,
        user._id
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
      await invalidateQuery(queryClient, "totalUsers");
    }
  };

  return (
    <div className="w-full flex items-center gap-1 relative">
      {isLoading && (
        <div className="w-full h-full absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md shadow-inner border border-white/40 rounded-lg">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-lg shadow-xl">
            <LoadingSpinner size="sm" color="#a29bfe" />
          </div>
        </div>
      )}

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

      <div className="w-3/4">
        {!user?.isDeleted ? (
          <Button
            disabled={isLoading}
            className="w-full min-h-3 bg-red-500 hover:bg-red-600 text-white-50 transition-all"
            onClick={handleDelete}
          >
            <Package className="w-1 h-1" />
            {t(
              "routes.dashboard.routes.users.routes.totalUsers.components.UserCardActions.archiveUser"
            )}
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            className="w-full min-h-3 bg-success-500 hover:bg-success-600 text-white-50 transition-all"
            onClick={handleUnDelete}
          >
            <PackageOpen />
            {t(
              "routes.dashboard.routes.users.routes.totalUsers.components.UserCardActions.restoreUser"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(UserCardActions);
