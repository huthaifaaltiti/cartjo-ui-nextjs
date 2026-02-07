"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
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

  const {
    status: reverifyStatus,
    isSuccess,
    message,
  } = useSelector((state: RootState) => state.verifyEmail.reverify);
  const { locale } = useSelector((state: RootState) => state.general);

  const loading = reverifyStatus === "loading";
  const isError = reverifyStatus === "error";

  const handleRequestNewVerifyLink = async () => {
    if (status === "unauthenticated") {
      showWarningToast({
        title: t(
          "routes.verifyEmail.components.RequestNewLinkBtn.mustLoginTitle",
        ),
        description: t(
          "routes.verifyEmail.components.RequestNewLinkBtn.mustLoginDesc",
        ),
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

    await dispatch(reVerifyEmail({ email: user.email, lang: locale }));
  };

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={handleRequestNewVerifyLink}
        disabled={loading || isSuccess}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white-50 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" size={20} />
            {t("routes.verifyEmail.components.RequestNewLinkBtn.sending")}
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="text-green-400 mr-2" size={20} />
            {t("routes.verifyEmail.components.RequestNewLinkBtn.linkSent")}
          </>
        ) : (
          t("routes.verifyEmail.components.RequestNewLinkBtn.requestNewLink")
        )}
      </Button>

      {/* Success Message Display */}
      {isSuccess && message && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm animate-in fade-in slide-in-from-top-1">
          <CheckCircle size={16} className="shrink-0" />
          <p>{message}</p>
        </div>
      )}

      {/* Error Message Display */}
      {isError && message && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={16} className="shrink-0" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default memo(RequestNewLinkBtn);
