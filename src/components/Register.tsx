import { memo } from "react";
import RegisterForm from "./RegisterForm";
import { useTranslations } from "next-intl";

const Register: React.FC = () => {
  const t = useTranslations("");

  return (
    <div className="w-full min-h-[70vh] text-text-primary-400 pt-8">
      <div className="flex items-center justify-center">
        <p className="w-1/2 text-center text-text-primary-200 text-sm ">
          {t("routes.auth.components.AuthTabs.components.register.hint")}
        </p>
      </div>

      <div className="w-full px-0 md:px-24 lg:px-56 mt-5">
        <RegisterForm />
      </div>
    </div>
  );
};

export default memo(Register);
