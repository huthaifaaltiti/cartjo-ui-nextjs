"use client";

import {
  showErrorToast,
  showSuccessToast,
} from "@/components/shared/CustomToast";
import { useAuthContext } from "@/hooks/useAuthContext";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataResponse } from "@/types/service-response.type";
import { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { useTranslations } from "next-intl";
import { createContext, ReactNode, useContext, useState } from "react";

type UserProfileContextProps = {
  handleSubmitAll: () => Promise<DataResponse<User> | void>;
  contactForm?: {
    trigger: () => Promise<boolean>;
    getValues: () => any;
  };
  personalForm?: {
    trigger: () => Promise<boolean>;
    getValues: () => any;
  };
  setContactForm: React.Dispatch<
    React.SetStateAction<
      { trigger: () => Promise<boolean>; getValues: () => any } | undefined
    >
  >;
  setPersonalForm: React.Dispatch<
    React.SetStateAction<
      { trigger: () => Promise<boolean>; getValues: () => any } | undefined
    >
  >;
  isSubmitting: boolean;
};

const UserProfileContext = createContext<UserProfileContextProps | undefined>(
  undefined
);

type UserProfileContextProviderProps = {
  children: ReactNode;
};

export const UserProfileContextProvider = ({
  children,
}: UserProfileContextProviderProps) => {
  const t = useTranslations();
  const { accessToken, userId, locale } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState<
    { trigger: () => Promise<boolean>; getValues: () => any } | undefined
  >(undefined);

  const [personalForm, setPersonalForm] = useState<
    { trigger: () => Promise<boolean>; getValues: () => any } | undefined
  >(undefined);

  const handleSubmitAll = async (): Promise<DataResponse<User> | void> => {
    if (!contactForm || !personalForm) return;

    try {
      const [contactValues, personalValues, contactValid, personalValid] =
        await Promise.all([
          contactForm.getValues(),
          personalForm.getValues(),
          contactForm.trigger(),
          personalForm.trigger(),
        ]);

      if (!contactValid || !personalValid) return;

      const url = `${API_ENDPOINTS.USER.UPDATE_PROFILE}/${userId}`;

      const body = {
        firstName: personalValues.firstName,
        lastName: personalValues.lastName,
        email: contactValues.email,
        phoneNumber: contactValues.phoneNumber,
        countryCode: "+962",
        gender: personalValues.gender,
        birthDate: personalValues.birthDate,
        lang: locale,
      };

      setIsSubmitting(true);

      const response = await fetcher<DataResponse<User>>(
        new URL(url),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
        locale
      );

      if (response.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: response?.message,
          dismissText: t("general.toast.dismissText"),
        });
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast({
          title: t("general.toast.title.success"),
          description: error?.message,
          dismissText: t("general.toast.dismissText"),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        handleSubmitAll,
        contactForm,
        setContactForm,
        personalForm,
        setPersonalForm,
        isSubmitting,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error(
      "UserProfileContext must be used within a UserProfileContextProvider"
    );
  }
  return context;
};
