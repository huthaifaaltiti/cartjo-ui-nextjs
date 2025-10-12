"use client";

import { memo, useMemo } from "react";
import { useUserProfileQuery } from "@/hooks/react-query/useUserProfileQuery";
import { getQueryUIState } from "@/utils/uiStateHelpers";
import UserProfileContactInfo from "./contact-info/UserProfileContactInfo";
import UserProfileContactInfoLoading from "./contact-info/UserProfileContactInfoLoading";
import UserProfilePersonalInfo from "./personal-info/UserProfilePersonalInfo";
import UserProfilePersonalInfoLoading from "./personal-info/UserProfilePersonalInfoLoading";
import { UserProfileContextProvider } from "@/contexts/UserProfileContext";
import UserProfileSubmitBtn from "./UserProfileSubmitBtn";

const UserProfileContent = ({
  userId,
}: {
  userId: string | null | undefined;
}) => {
  const { data, isLoading, isFetching, isFetched, isError, error } =
    useUserProfileQuery(userId);

  const user = useMemo(() => data?.data ?? null, [data]);

  const { showLoader, showError, showNoData, showData } = getQueryUIState({
    data: user ?? null,
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
    isSuccess: data?.isSuccess ?? false,
  });

  const containerClass = "w-full mt-1";

  if (showLoader) {
    return (
      <div className={`${containerClass} flex flex-col gap-5`}>
        <UserProfileContactInfoLoading />
        <UserProfilePersonalInfoLoading />
      </div>
    );
  }

  if (showError) {
    return <div className="w-full flex items-center mt-3">showError</div>;
  }

  if (showNoData) {
    return <div className="w-full flex items-center mt-3">no data</div>;
  }

  if (showData) {
    return (
      <div className={`${containerClass} flex flex-col gap-5`}>
        <UserProfileContextProvider>
          <UserProfileContactInfo user={user!} />
          <UserProfilePersonalInfo user={user!} />
          <UserProfileSubmitBtn />
        </UserProfileContextProvider>
      </div>
    );
  }

  return null;
};

export default memo(UserProfileContent);
