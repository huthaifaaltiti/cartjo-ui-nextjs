"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {
  const t = useTranslations("routes.auth.components.AuthTabs.components.login");

  return (
    <div className="w-full min-h-[70vh] text-text-primary-400 pt-8">
      <div className="flex items-center justify-center">
        <p className="w-1/2 text-center text-text-primary-200 text-sm ">
          {t("hint")}
        </p>
      </div>

      <div className="w-full px-0 md:px-24 lg:px-56 mt-5">
        <LoginForm />
      </div>
    </div>
  );
};

export default memo(Login);
