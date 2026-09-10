"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCreatorDashboardNavLinks } from "@/hooks/useCreatorDashboardNavLinks";

const CreatorDashboardControlNavLinks = () => {
  const pathname = usePathname();
  const t = useTranslations();
  const navLinks = useCreatorDashboardNavLinks();

  const hoverClass = "hover:bg-primary-500 hover:text-white-50 transition-all";
  const activeClass = "bg-primary-500 text-white-50 font-medium shadow-2xs";

  return (
    <div className="w-full">
      <p className="text-text-primary-100 text-sm mb-4 border-l-2 border-primary-500 px-2 rtl:border-l-0 rtl:border-r-2 rtl:border-primary-500 font-medium">
        {t("routes.creators.routes.dashboard.layout.navigation")}
      </p>

      <ul className="flex flex-col gap-1.5 px-1">
        {navLinks.map(({ label, href, rawHref, icon: Icon, isCompleted }) => {
          const isActive =
            rawHref === "/creators/dashboard"
              ? pathname.endsWith("/creators/dashboard") ||
                pathname.endsWith("/creators/dashboard/")
              : pathname.includes(rawHref);

          return isCompleted ? (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm text-gray-700 ${hoverClass} ${
                  isActive ? activeClass : ""
                } flex items-center gap-2.5 px-3 py-2.5 rounded-lg`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
              </Link>
            </li>
          ) : (
            <li>
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed opacity-75 hover:bg-gray-50"
                title={t("general.others.comingSoon") || "Coming Soon"}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 shrink-0 text-gray-400" />
                  <span>{label}</span>
                </div>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-medium">
                  {t("routes.creators.routes.dashboard.layout.soon")}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(CreatorDashboardControlNavLinks);
