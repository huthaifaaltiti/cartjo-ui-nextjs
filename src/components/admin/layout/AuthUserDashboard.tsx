"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import NoLoggedUserState from "../../shared/NoLoggedUserState";
import ManageDashboard from "../ManageDashboard";
import RegularUserLoggedState from "../../shared/RegularUserLoggedState";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import isAdminClientSide from "@/utils/isAdminClientSide.util";

const AuthUserDashboard = () => {
  const t = useTranslations();

  const { session, loading } = useSelector(
    (state: RootState) => state.authentication,
  );
  const canManage = isAdminClientSide(session) ?? false;

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
