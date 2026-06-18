"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import UserAvatarByName from "@/components/shared/UserAvatarByName";
import ErrorMessage from "@/components/shared/ErrorMessage";
import UserInfoRowSkeleton from "./UserInfoRowSkeleton";
import UserInfoNoData from "./UserInfoNoData";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const UserInfoRow = () => {
  const t = useTranslations();

  const { session, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.authentication,
  );

  const showLoader = loading;
  const showData = session;
  const showError = !loading && !session;
  const showNoData = isAuthenticated && !session;

  const containerClass = "w-full min-w-10";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <UserInfoRowSkeleton />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={t("routes.user.layout.components.UserInfoRow.failed")}
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <UserInfoNoData />
      </div>
    );
  }

  if (showData) {
    const { firstName, lastName, email } = session;

    return (
      <div className={containerClass}>
        <div className="flex items-center gap-4">
          <UserAvatarByName
            firstName={firstName!}
            lastName={lastName!}
            bgClassName="bg-gradient-to-br from-gray-500 to-gray-600 border border-primary-100"
            size="lg"
          />
          <div className="flex flex-col gap-1 overflow-hidden">
            <span className="font-semibold text-text-primary-200 truncate">
              {firstName} {lastName}
            </span>
            <span className="text-text-primary-100 text-sm truncate">
              {email}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default memo(UserInfoRow);
