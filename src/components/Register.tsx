import { memo } from "react";
import RegisterForm from "./RegisterForm";
import { useTranslations } from "next-intl";
import GoogleAuthentication from "./user/auth/GoogleRegister";

const Register: React.FC = () => {
  const t = useTranslations(
    "routes.auth.components.AuthTabs.components.register",
  );
  const tCommon = useTranslations("general.others");

  return (
    <div className="w-full min-h-[70vh] text-text-primary-400 pt-8">
      <div className="flex items-center justify-center mb-6">
        <p className="text-center text-text-primary-200 text-sm max-w-lg">
          {t("hint")}
        </p>
      </div>

      <div className="w-full px-0 md:px-24 lg:px-56 mt-5 flex flex-col">
        {/* Primary Action */}
        <GoogleAuthentication signUp={true} signIn={false} />

        {/* Divider */}
        <div className="relative flex py-8 items-center">
          <div className="flex-grow border-t border-gray-200/20"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-text-primary-300 font-medium">
            {tCommon("or")?.toUpperCase()}
          </span>
          <div className="flex-grow border-t border-gray-200/20"></div>
        </div>

        {/* Secondary Action */}
        <div className="space-y-4">
          <p className="text-center text-sm text-text-primary-300 mb-5">
            {/* {t.rich("formTitle", {
              cartjo: (chunks) => (
                <span className="font-semibold text-primary">{chunks}</span>
              ),
            })} */}
            {t("formTitle")}
          </p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default memo(Register);
