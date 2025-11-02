"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { showWarningToast } from "@/components/shared/CustomToast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { reVerifyEmail } from "@/redux/slices/authorization/verifyEmail/actions";

const RequestNewLinkBtn = () => {
  const t = useTranslations();
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { status: reverifyStatus, isSuccess } = useSelector(
    (state: RootState) => state.verifyEmail.reverify
  );

  const loading = reverifyStatus === "loading";

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

    await dispatch(reVerifyEmail({ email: user.email, lang: "en" }));
  };

  return (
    <Button
      onClick={handleRequestNewVerifyLink}
      disabled={loading || isSuccess}
      className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white-50 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin mr-2" />
          {t("routes.verifyEmail.components.RequestNewLinkBtn.sending")}
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle className="text-green-400 mr-2" />
          {t("routes.verifyEmail.components.RequestNewLinkBtn.linkSent")}
        </>
      ) : (
        t("routes.verifyEmail.components.RequestNewLinkBtn.requestNewLink")
      )}
    </Button>
  );
};

export default memo(RequestNewLinkBtn);
