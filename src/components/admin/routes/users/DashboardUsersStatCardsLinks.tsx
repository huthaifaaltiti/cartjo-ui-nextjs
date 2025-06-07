import { memo } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ExternalLink } from "lucide-react";

const DashboardUsersStatCardsLinks = () => {
  const t = useTranslations();
  const locale: string = useLocale();

  const userStatCardsLinks: { label: string; link: string }[] = [
    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.totalUsers"
      ),
      link: "total-users",
    },

    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.activeUsers"
      ),
      link: "active-users",
    },

    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.deletedUsers"
      ),
      link: "deleted-users",
    },

    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.adminUsers"
      ),
      link: "admin-users",
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-8 my-5 px-7">
        {userStatCardsLinks.map((userStatCardsLink, i) => (
          <span
            className="text-primary-500 hover:text-primary-100"
            key={`userStatCardLink-${i}`}
          >
            <Link href={`/${locale}/dashboard/users/${userStatCardsLink.link}`}>
              <span className="flex items-center gap-1">
                {userStatCardsLink.label}
                <ExternalLink className="w-3 h-3" />
              </span>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
};

export default memo(DashboardUsersStatCardsLinks);
