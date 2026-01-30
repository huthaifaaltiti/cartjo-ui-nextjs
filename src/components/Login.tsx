import { memo } from "react";
import { useTranslations } from "next-intl";
import LoginForm from "./LoginForm";
import GoogleAuthentication from "./user/auth/GoogleRegister";

const Login = () => {
  const t = useTranslations("routes.auth.components.AuthTabs.components.login");
  const tCommon = useTranslations("general.others");

  return (
    <div className="w-full min-h-[70vh] text-text-primary-400 pt-8">
      <div className="flex items-center justify-center mb-6">
        <p className="text-center text-text-primary-200 text-sm max-w-lg">
          {t("preHint")}
        </p>
      </div>

      <div className="w-full px-0 md:px-24 lg:px-56 mt-5 flex flex-col">
        {/* Primary Action */}
        <GoogleAuthentication signUp={false} signIn={true} />

        {/* Intuitive Divider */}
        <div className="relative flex py-8 items-center">
          <div className="flex-grow border-t border-gray-200/20"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-text-primary-300 font-medium">
            {tCommon("or")?.toUpperCase()}
          </span>
          <div className="flex-grow border-t border-gray-200/20"></div>
        </div>

        {/* Secondary Action */}
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-5">
            <p className="text-center text-text-primary-300 text-sm">
              {t("hint")}
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default memo(Login);
