import { memo } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

import Logo from "../../shared/Logo";
import DashboardLoggedUserDetails from "./DashboardLoggedUserDetails";
import DashboardControlNavLinks from "./DashboardControlNavLinks";
import LanguageSelector from "@/components/LanguageSelector";

const DashboardSideNav = () => {
  const locale = useLocale();

  return (
    <aside className="h-full w-full p-4">
      <ul className="h-full flex flex-col gap-8">
        <li className="p-2 bg-primary-950 rounded">
          <Link href={`/${locale}/dashboard`}>
            <Logo />
          </Link>
        </li>

        <li>
          <DashboardLoggedUserDetails />
        </li>

        <li>
          <DashboardControlNavLinks />
        </li>

        <li className="mt-auto">
          <LanguageSelector />
        </li>
      </ul>
    </aside>
  );
};

export default memo(DashboardSideNav);
