"use client";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { BaseResponse } from "@/types/service-response.type";
import { fetcher } from "@/utils/fetcher";
import { createContext, ReactNode, useContext } from "react";

type VerifyEmailContextType = {
  verify: (token: string, lang: Locale | string) => Promise<BaseResponse>;
  reVerify: (email: string, lang: Locale | string) => Promise<BaseResponse>;
};

const VerifyEmailContext = createContext<undefined | VerifyEmailContextType>(
  undefined
);

type VerifyEmailContextProviderType = {
  children: ReactNode;
};
export const VerifyEmailContextProvider = ({
  children,
}: VerifyEmailContextProviderType) => {
  const verify = async (
    token: string,
    lang: Locale | string = "en"
  ): Promise<BaseResponse> => {
    const url = new URL(`${API_ENDPOINTS.VERIFY_EMAIL.VERIFY}`);

    if (lang) url.searchParams.append("lang", lang);
    if (token) url.searchParams.append("token", token);

    return fetcher(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const reVerify = async (
    email: string,
    lang: Locale | string = "en"
  ): Promise<BaseResponse> => {
    const url = new URL(`${API_ENDPOINTS.VERIFY_EMAIL.REVERIFY}`);

    return fetcher(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang }),
    });
  };

  return (
    <VerifyEmailContext.Provider
      value={{
        verify,
        reVerify
      }}
    >
      {children}
    </VerifyEmailContext.Provider>
  );
};

export const useVerifyEmail = () => {
  const context = useContext(VerifyEmailContext);

  if (!context)
    throw Error(
      "Verify Email context should be used within verify email context provider"
    );

  return context;
};
