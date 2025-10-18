"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useVerifyEmail } from "@/contexts/VerifyEmailContext";
import { useGeneralContext } from "@/contexts/General.context";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { showWarningToast } from "@/components/shared/CustomToast";

const RequestNewLinkBtn = () => {
  const t = useTranslations();
  const { data: sessionData, status } = useSession();
  const { reVerify } = useVerifyEmail();
  const { locale } = useGeneralContext();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequestNewVerifyLink = async () => {
    if (status === "unauthenticated") {
      showWarningToast({
        title: t("routes.verifyEmail.components.RequestNewLinkBtn.mustLoginTitle"),
        description: t("routes.verifyEmail.components.RequestNewLinkBtn.mustLoginDesc"),
        dismissText: t("general.toast.dismissText"),
      });

      setTimeout(() => {
        router.push(`/auth?redirectTo=/verify-email&resend=true`);
      }, 1500);

      return;
    }

    if (status !== "authenticated") return;

    const { user } = sessionData;
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await reVerify(user.email, locale);
      if (res?.isSuccess) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Resend verification failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRequestNewVerifyLink}
      disabled={loading || success}
      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white-50 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2" /> {t("routes.verifyEmail.components.RequestNewLinkBtn.sending")}
        </>
      ) : success ? (
        <>
          <CheckCircle className="text-green-400 mr-2" /> {t("routes.verifyEmail.components.RequestNewLinkBtn.linkSent")}
        </>
      ) : (
        t("routes.verifyEmail.components.RequestNewLinkBtn.requestNewLink")
      )}
    </Button>
  );
};

export default memo(RequestNewLinkBtn);
