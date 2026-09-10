import { memo } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import LanguageSelector from "@/components/LanguageSelector";
import BackToHomePage from "@/components/shared/BackToHomePage";
import { LogoutBtn } from "@/components/shared/LogoutBtn";
import DashboardLoggedUserDetails from "@/components/admin/layout/DashboardLoggedUserDetails";
import CreatorDashboardControlNavLinks from "./CreatorDashboardControlNavLinks";
import DynamicCreatorsLogo from "../DynamicCreatorsLogo";
import { isArabicLocale } from "@/config/locales.config";
import { Sparkles } from "lucide-react";

const CreatorDashboardSideNav = () => {
  const locale = useLocale();
  const t = useTranslations("");
  const isArabic = isArabicLocale(locale);

  return (
    <aside className="h-full w-full p-4 overflow-hidden flex flex-col">
      <ul className="h-full flex flex-col gap-4 overflow-hidden">
        <li className="p-2 bg-white-50 rounded flex flex-col gap-3 shrink-0">
          <Link href={`/${locale}/creators/dashboard`}>
            <DynamicCreatorsLogo isArabic={isArabic} />
          </Link>

          <span className="hidden md:inline-flex text-nowrap items-center gap-1.5 text-xs font-semibold text-primary-700">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            {t("routes.creators.routes.dashboard.layout.portal")}
          </span>
        </li>

        <li className="shrink-0">
          <DashboardLoggedUserDetails />
        </li>

        <li className="w-full flex-1 min-h-0 overflow-y-auto">
          <ul className="w-full min-h-full flex flex-col justify-between gap-6">
            <li>
              <CreatorDashboardControlNavLinks />
            </li>

            <li className="mt-auto flex flex-wrap items-end justify-start gap-2 border-t pt-4 shrink-0">
              <div className="w-full flex items-center gap-1 flex-wrap">
                <BackToHomePage />
                <LanguageSelector />
                <LogoutBtn variant="bordered" />
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
};

export default memo(CreatorDashboardSideNav);
