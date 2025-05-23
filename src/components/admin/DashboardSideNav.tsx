import { memo } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

import Logo from "../shared/Logo";
import DashboardLoggedUserDetails from "./DashboardLoggedUserDetails";
import DashboardControlNavLinks from "./DashboardControlNavLinks";

const DashboardSideNav = () => {
  const locale = useLocale();

  return (
    <aside className="h-full w-full p-4">
      <ul className="flex flex-col gap-8">
        {/* Logo */}
        <li className="p-2 bg-gray-800 rounded">
          <Link href={`/${locale}/dashboard`}>
            <Logo />
          </Link>
        </li>

        {/* User Details */}
        <li>
          <DashboardLoggedUserDetails />
        </li>

        {/* Navigation Links */}
        <li>
          <DashboardControlNavLinks />
        </li>
      </ul>
    </aside>
  );
};

export default memo(DashboardSideNav);
