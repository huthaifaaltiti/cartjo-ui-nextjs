"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import NoLoggedUserState from "../../shared/NoLoggedUserState";
import ManageDashboard from "../ManageDashboard";
import RegularUserLoggedState from "../../shared/RegularUserLoggedState";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { checkCanAccessDashboardClientSide, isAdminClientSide } from "@/utils/session-access.utils";

const AuthUserDashboard = () => {
  const t = useTranslations();

  const { session, loading } = useSelector(
    (state: RootState) => state.authentication,
  );
  const isAdmin = isAdminClientSide(session) ?? false;
  const checkCanAccessDashboard = checkCanAccessDashboardClientSide(session) ?? false;
  const canManage = isAdmin && checkCanAccessDashboard;

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          text={t("general.loadingStates.loadingUserSession")}
        />
      </div>
    );
  }

  if (!session) {
    return <NoLoggedUserState />;
  }

  if (canManage) {
    return <ManageDashboard />;
  }

  return <RegularUserLoggedState />;
};

export default memo(AuthUserDashboard);
