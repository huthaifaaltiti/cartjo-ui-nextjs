import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
  provider?: string | null;
  status: "idle" | "loading" | "success" | "error";
}

const AuthCallbackView = ({ provider, status }: Props) => {
  const t = useTranslations(
    "routes.auth.routes.callback.components.AuthCallbackView",
  );

  const providerName =
    (provider && t(`providers.${provider}`)) || t("providers.default");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/assets/image/webp/logo-solo_purple.webp"
          alt="Logo"
          width={80}
          height={80}
          priority
          className={status === "loading" ? "animate-pulse" : ""}
        />

        <p className="text-white text-sm tracking-wide text-center">
          {status === "loading" && t("loading", { provider: providerName })}
          {status === "success" && t("success")}
          {status === "error" && t("error")}
        </p>

        {status === "loading" && (
          <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
        )}
      </div>
    </div>
  );
};

export default AuthCallbackView;
