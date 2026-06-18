"use client";

import { memo } from "react";
import { UserRoundX, UsersRound, ShieldCheck, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import StatCard from "@/components/shared/StatCard";
import { StatCardType } from "@/types/statCard";
import { UsersStats } from "@/types/UsersStats";

const DashboardUsersStatCards = ({ stats }: { stats: UsersStats }) => {
  const t = useTranslations();

  const userStatCards: StatCardType[] = [
    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.totalUsers",
      ),
      value: stats?.totalUsers ?? 0,
      color: "orange",
      icon: UsersRound,
    },
    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.activeUsers",
      ),
      value: stats?.activeUsers ?? 0,
      color: "green",
      icon: ShieldCheck,
    },
    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.deletedUsers",
      ),
      value: stats?.deletedUsers ?? 0,
      color: "red",
      icon: UserRoundX,
    },
    {
      label: t(
        "routes.dashboard.routes.users.components.DashboardUsersStatCards.adminUsers",
      ),
      value: stats?.admins ?? 0,
      color: "yellow",
      icon: UserCheck,
    },
  ];

  return (
    <div className="w-full h-auto">
      <div className="w-full flex items-center flex-wrap gap-3">
        {userStatCards.map((userStatCard) => (
          <StatCard
            key={userStatCard.label}
            label={userStatCard.label}
            value={userStatCard.value}
            color={userStatCard.color}
            icon={userStatCard.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(DashboardUsersStatCards);
