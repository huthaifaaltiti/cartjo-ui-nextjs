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

// Define form value types
type ContactFormValues = {
  email: string;
  phoneNumber: string;
};

type PersonalFormValues = {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  nationality: string;
};

type AccountPasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Define form type
type FormControls<T> = {
  trigger: () => Promise<boolean>;
  getValues: () => T;
};

type UserProfileContextProps = {
  handleSubmitAll: () => Promise<DataResponse<User> | void>;
  contactForm?: FormControls<ContactFormValues>;
  personalForm?: FormControls<PersonalFormValues>;
  setContactForm: React.Dispatch<
    React.SetStateAction<FormControls<ContactFormValues> | undefined>
  >;
  setPersonalForm: React.Dispatch<
    React.SetStateAction<FormControls<PersonalFormValues> | undefined>
  >;
  setPasswordInfo: React.Dispatch<
    React.SetStateAction<FormControls<AccountPasswordFormValues> | undefined>
  >;
  isSubmitting: boolean;
};

const UserProfileContext = createContext<UserProfileContextProps | undefined>(
  undefined,
);

type UserProfileContextProviderProps = {
  children: ReactNode;
};

export const UserProfileContextProvider = ({
  children,
}: UserProfileContextProviderProps) => {
  const t = useTranslations();
  const { accessToken, userId, locale } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState<
    FormControls<ContactFormValues> | undefined
  >(undefined);
  const [personalForm, setPersonalForm] = useState<
    FormControls<PersonalFormValues> | undefined
  >(undefined);
  const [passwordInfo, setPasswordInfo] = useState<
    FormControls<AccountPasswordFormValues> | undefined
  >(undefined);

  const handleSubmitAll = async (): Promise<DataResponse<User> | void> => {
    if (!contactForm || !personalForm || !passwordInfo) return;

    try {
      const [
        contactValues,
        personalValues,
        contactValid,
        personalValid,
        passwordInfoValid,
        passwordInfoValues,
      ] = await Promise.all([
        contactForm.getValues(),
        personalForm.getValues(),
        contactForm.trigger(),
        personalForm.trigger(),
        passwordInfo.trigger(),
        passwordInfo.getValues(),
      ]);

      if (!contactValid || !personalValid || !passwordInfoValid) return;

      const url = `${API_ENDPOINTS.USER.UPDATE_PROFILE}/${userId}`;
      const body = {
        firstName: personalValues.firstName,
        lastName: personalValues.lastName,
        email: contactValues.email,
        phoneNumber: contactValues.phoneNumber,
        countryCode: "+962",
        gender: personalValues.gender,
        birthDate: personalValues.birthDate,
        nationality: personalValues.nationality,
        newPassword: passwordInfoValues.newPassword,
        currentPassword: passwordInfoValues.currentPassword,
        lang: locale,
      };

      setIsSubmitting(true);

      const response = await fetcher<DataResponse<User>>(new URL(url), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

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
          title: t("general.toast.title.error"),
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
        personalForm,
        setContactForm,
        setPersonalForm,
        isSubmitting,
        setPasswordInfo,
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
      "UserProfileContext must be used within a UserProfileContextProvider",
    );
  }

  return context;
};
