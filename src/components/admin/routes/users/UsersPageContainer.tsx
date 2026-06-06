"use client";

import { memo } from "react";
import DashboardUsersStatCards from "./DashboardUsersStatCards";
import DashboardUsersStatCardsLinks from "./DashboardUsersStatCardsLinks";
import { useUsersStats } from "@/hooks/react-query/useUsersStats";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";

const UsersPageContainer = () => {
  const t = useTranslations(
    "routes.dashboard.routes.users.components.UsersPageContainer",
  );

  const { isSessionLoading, isAuthenticated } = useAuthContext();
  const { data, isLoading, isError, error } = useUsersStats();

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = data?.isSuccess && !data?.stats;
  const showData = data?.isSuccess && !!data?.stats;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/users"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage
          message={error?.message || "Failed to load users statistics"}
        />
      </div>
    );
  }

  if (showNoData)
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">{t("noData")}</p>
      </div>
    );

  if (showData) {
    return (
      <div className="w-full h-full p-3">
        <div className="w-full border-b">
          <DashboardUsersStatCards stats={data?.stats} />
          <DashboardUsersStatCardsLinks />
        </div>
      </div>
    );
  }

  return null;
};

export default memo(UsersPageContainer);
