"use client";

import { memo } from "react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import NoLoggedUserState from "../shared/NoLoggedUserState";
import ManageDashboard from "./ManageDashboard";
import RegularUserLoggedState from "../shared/RegularUserLoggedState";
import Spinner from "../shared/Spinner";

type ExtendedSession = Session & {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    canManage?: boolean;
  };
};

const AuthUserDashboard = () => {
  const t = useTranslations();
  const { data: sessionData, status } = useSession();

  const session = sessionData as ExtendedSession | null;
  const canManage = session?.user?.canManage ?? false;

  if (status === "loading") {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <Spinner
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
