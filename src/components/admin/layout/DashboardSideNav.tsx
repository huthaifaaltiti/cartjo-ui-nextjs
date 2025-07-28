import { memo } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Home } from "lucide-react";

import Logo from "../../shared/Logo";
import DashboardLoggedUserDetails from "./DashboardLoggedUserDetails";
import DashboardControlNavLinks from "./DashboardControlNavLinks";
import LanguageSelector from "@/components/LanguageSelector";
import BackToHomePage from "@/components/shared/BackToHomePage";

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

        <li className="mt-auto flex flex-wrap items-end justify-start gap-2">
          <LanguageSelector />
          <BackToHomePage />
        </li>
      </ul>
    </aside>
  );
};

export default memo(DashboardSideNav);
