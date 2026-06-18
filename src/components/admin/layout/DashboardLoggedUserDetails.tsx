"use client";

import LoadingSpinner from "@/components/shared/loaders/LoadingSpinner";
import { RootState } from "@/redux/store";
import { memo } from "react";
import { useSelector } from "react-redux";

const DashboardLoggedUserDetails = () => {
  const { session, loading } = useSelector(
    (state: RootState) => state.authentication,
  );

  if (loading) {
    return (
      <div className="w-full min-h-14 p-3 bg-white-50 flex items-center justify-center rounded">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!session) return null;

  const fullName =
    `${session.firstName ?? ""} ${session.lastName ?? ""}`.trim() ||
    session.username;

  return (
    <div className="w-full flex items-center gap-3 min-h-14 bg-white-50 p-3 rounded border border-gray-100">
      <div className="flex flex-col">
        <p className="text-sm text-primary-500 font-bold leading-none">
          {fullName}
        </p>
        <p className="text-xs text-gray-500 mt-1 capitalize">
          {session.role.toLowerCase()}
        </p>
      </div>
    </div>
  );
};

export default memo(DashboardLoggedUserDetails);
