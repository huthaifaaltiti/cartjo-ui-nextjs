import { memo } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

import Logo from "../shared/Logo";

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
        <li className="flex items-center gap-3">
          <img
            src="/images/user-avatar.png"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">Huthaifa Altiti</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </li>

        {/* Navigation Links */}
        <li>
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                href="/dashboard/locations"
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                📍 Locations
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                👥 Users
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
};

export default memo(DashboardSideNav);
