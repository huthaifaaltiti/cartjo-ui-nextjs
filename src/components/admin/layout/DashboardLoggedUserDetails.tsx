"use client";

import { memo } from "react";
import { useSession } from "next-auth/react";

import { ExtendedSession } from "@/types/session";

import LoadingSpinner from "../../shared/LoadingSpinner";

const DashboardLoggedUserDetails = () => {
  const { data: sessionData, status } = useSession();

  const session = sessionData as ExtendedSession | null;

  if (status === "loading") {
    return (
      <div className="w-full min-h-14 p-3 bg-white-50 flex items-center justify-center rounded">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="w-full flex items-center gap-3 min-h-14 bg-white-50 p-3 rounded">
      <div>
        <p className="text-sm text-primary-500 font-bold">
          {session?.user?.firstName + " " + session?.user?.lastName}
        </p>
        <p className="text-xs text-gray-500">{session?.user?.role}</p>
      </div>
    </div>
  );
};

export default memo(DashboardLoggedUserDetails);
