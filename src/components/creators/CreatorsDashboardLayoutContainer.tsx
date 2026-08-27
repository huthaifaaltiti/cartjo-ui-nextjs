"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sparkles, Video, User, LayoutDashboard } from "lucide-react";
import DynamicCreatorsLogo from "@/components/creators/DynamicCreatorsLogo";
import { LogoutBtn } from "@/components/shared/LogoutBtn";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { Locale } from "@/types/locale";
import { isArabicLocale } from "@/config/locales.config";

interface CreatorsDashboardLayoutContainerProps {
  children: React.ReactNode;
  locale: Locale;
  session: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function CreatorsDashboardLayoutContainer({
  children,
  locale,
  session,
}: CreatorsDashboardLayoutContainerProps) {
  const t = useTranslations("routes.creators.dashboard.layout");
  const tg = useTranslations("general");
  const isAr = isArabicLocale(locale);

  return (
    <div className="min-h-screen bg-white-50 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full bg-white-50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <MaxWidthWrapper className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/creators/dashboard`}>
              <DynamicCreatorsLogo isArabic={isAr} />
            </Link>
            <span className="hidden md:inline-flex text-nowrap items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-primary-600/10 text-primary-600 border border-primary-600/20 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              {t("portal")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* User Profile Info */}
            <div className="hidden sm:flex items-center gap-3 border-r border-slate-800 pr-4">
              <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                {session.firstName?.[0]?.toUpperCase() || "C"}
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-600">
                  {session.firstName} {session.lastName}
                </p>
                <p className="text-[10px] text-gray-600">{session.email}</p>
              </div>
            </div>

            {/* Logout Action */}
            <div className="w-24 flex justify-end">
              <LogoutBtn withIcon={true} />
            </div>
          </div>
        </MaxWidthWrapper>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-100/90 border-r border-slate-850 p-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-4">
            {t("navigation")}
          </p>
          <nav className="space-y-1">
            <Link
              href={`/${locale}/creators/dashboard`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-purple-600/15 text-purple-300 border border-purple-500/10 hover:bg-purple-600/20 transition-all"
            >
              <Video className="w-4 h-4" />
              {t("myVideos")}
            </Link>

            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed opacity-60"
              title={tg("others.comingSoon") || "Coming Soon"}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>{t("analytics")}</span>
              </div>
              <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                {t("soon")}
              </span>
            </div>

            <div
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed opacity-60"
              title={tg("others.comingSoon") || "Coming Soon"}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <span>{t("profileSettings")}</span>
              </div>
              <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                {t("soon")}
              </span>
            </div>
          </nav>
        </aside>

        {/* Content Container */}
        <main className="flex-1 bg-white-50 p-6 md:p-8">
          <MaxWidthWrapper>{children}</MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}
