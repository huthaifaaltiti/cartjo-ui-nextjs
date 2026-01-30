"use client";

import { memo } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ExtendedSession } from "@/types/session";
import NoLoggedUserState from "../../shared/NoLoggedUserState";
import ManageDashboard from "../ManageDashboard";
import RegularUserLoggedState from "../../shared/RegularUserLoggedState";
import LoadingSpinner from "../../shared/LoadingSpinner";
import { useRouter } from "next/navigation";

const AuthUserDashboard = () => {
  const t = useTranslations();
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  const session = sessionData as ExtendedSession | null;
  const canManage = session?.user?.canManage ?? false;

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.replace("/auth");
  //     return;
  //   }

  //   if (sessionData?.expires) {
  //     const expiresAt = new Date(sessionData.expires);
  //     if (expiresAt < new Date()) {
  //       router.replace("/auth");
  //     }
  //   }
  // }, [status, sessionData, router]);

  if (status === "loading") {
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
