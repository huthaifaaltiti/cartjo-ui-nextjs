"use client";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import assets from "@public/assets/assets.json";
import { useTranslations } from "next-intl";

const GoogleAuthentication = ({
  signIn = false,
  signUp = false,
}: {
  signIn: boolean;
  signUp: boolean;
}) => {
  const t = useTranslations(
    "routes.auth.components.AuthTabs.components.register.actions",
  );

  const handleGoogleClick = () => {
    window.location.href = API_ENDPOINTS.AUTH.GOOGLE;
  };

  if (!signIn && !signUp) return null;

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
    >
      <img src={assets.image.svg.google_g} alt="Google" className="h-5 w-5" />
      {signUp && t("signUpWithGoogle")}
      {signIn && t("signInWithGoogle")}
    </button>
  );
};

export default GoogleAuthentication;
