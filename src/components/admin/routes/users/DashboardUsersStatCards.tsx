import { memo } from "react";
import { UserRoundX, UsersRound, ShieldCheck, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import StatCard from "@/components/shared/StatCard";

import { UsersStats } from "@/types/UsersStats";
import { StatCardType } from "@/types/statCard";

type UsersPageContainerProps = {
  stats: UsersStats;
};

const DashboardUsersStatCards = ({ stats }: UsersPageContainerProps) => {
  const t = useTranslations();

  const userStatCards: StatCardType[] = [
    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.totalUsers"
      ),
      value: stats?.totalUsers,
      color: "orange",
      icon: UsersRound,
    },

    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.activeUsers"
      ),
      value: stats?.activeUsers,
      color: "green",
      icon: ShieldCheck,
    },

    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.deletedUsers"
      ),
      value: stats?.deletedUsers,
      color: "red",
      icon: UserRoundX,
    },

    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.adminUsers"
      ),
      value: stats?.admins,
      color: "yellow",
      icon: UserCheck,
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {userStatCards.map((userStatCard, i) => (
        <StatCard
          label={userStatCard.label}
          value={userStatCard?.value}
          color={userStatCard?.color}
          icon={userStatCard?.icon}
          key={`userStatCard-${i}`}
        />
      ))}
    </div>
  );
};

export default memo(DashboardUsersStatCards);
