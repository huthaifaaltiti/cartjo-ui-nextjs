"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useDashboardNavLinks } from "@/hooks/useDashboardNavLinks";

const DashboardControlNavLinks = () => {
  const pathname = usePathname();
  const t = useTranslations();
  const navLinks = useDashboardNavLinks();

  const hoverClass = "hover:bg-primary-500 hover:text-white-50 transition-all";
  const activeClass = "bg-primary-500 text-white-50";

  return (
    <div className="w-full">
      <p className="text-text-primary-100 text-sm mb-6 border-l px-1">
        {t("routes.dashboard.components.DashboardControlNavLinks.navLinks")}
      </p>

      <ul className="flex flex-col gap-1 px-1">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname?.includes(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm text-gray-700 ${hoverClass} ${
                  isActive ? activeClass : ""
                } flex items-center gap-2 px-3 py-3 rounded`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default memo(DashboardControlNavLinks);
