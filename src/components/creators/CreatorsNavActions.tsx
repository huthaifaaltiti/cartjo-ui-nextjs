"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Sparkles, LayoutDashboard, ArrowRight, LogIn } from "lucide-react";
import { Button } from "../ui/button";
import { UserRole } from "@/enums/user-role.enum";
import LanguageSelector from "@/components/LanguageSelector";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  isCreatorClientSide,
  checkCanAccessCreatorDashboardClientSide,
} from "@/utils/session-access.utils";

export default function CreatorsNavActions() {
  const t = useTranslations("routes.creators.header");

  const router = useRouter();

  const { session } = useAuthContext();
  const isCreator =
    isCreatorClientSide(session) ||
    checkCanAccessCreatorDashboardClientSide(session);

  return (
    <div className="flex items-center gap-4">
      <LanguageSelector />

      {!isCreator && (
        <Button
          variant="ghost"
          className="px-4 font-medium text-neutral-300 hover:text-white-50 hover:bg-white-50/10 transition-colors flex items-center gap-1.5"
          onClick={() => router.push("/auth?tab=login")}
        >
          <LogIn className="w-4 h-4 text-neutral-400" />
          <span>{t("signIn")}</span>
        </Button>
      )}

      {isCreator ? (
        <Button
          className="relative overflow-hidden group rounded-full px-5 py-2 text-sm font-semibold text-white-50 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
          onClick={() => router.push("/creators/dashboard")}
        >
          <LayoutDashboard className="w-4 h-4 text-white-50 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300" />
          <span>{t("dashboard")}</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-all duration-300" />
        </Button>
      ) : (
        <Button
          className="relative overflow-hidden group rounded-full px-5 py-2 text-sm font-semibold text-white-50 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 hover:from-primary-500 hover:to-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/45 hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
          onClick={() =>
            router.push(`/auth?role=${UserRole.CREATOR}&tab=register`)
          }
        >
          {/* Shimmer sweep animation on hover */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          <Sparkles className="w-4 h-4 text-white-50 animate-pulse group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
          <span>{t("becomeCreator")}</span>
        </Button>
      )}
    </div>
  );
}
