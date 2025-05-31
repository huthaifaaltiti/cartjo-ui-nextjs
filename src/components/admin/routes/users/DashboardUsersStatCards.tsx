import { memo } from "react";
import { UserRoundX, UsersRound, ShieldCheck, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import StatCard from "@/components/shared/StatCard";
import { UsersStats } from "@/types/UsersStats";

type UsersPageContainerProps = {
  stats: UsersStats;
};

const DashboardUsersStatCards = ({ stats }: UsersPageContainerProps) => {
  const t = useTranslations();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <StatCard
        label={t(
          "routes.dashboard.routes.users.components.DashboardUsersStatCards.totalUsers"
        )}
        value={stats?.totalUsers}
        color="purple"
        icon={UsersRound}
      />
      <StatCard
        label={t(
          "routes.dashboard.routes.users.components.DashboardUsersStatCards.activeUsers"
        )}
        value={stats?.activeUsers}
        color="green"
        icon={ShieldCheck}
      />
      <StatCard
        label={t(
          "routes.dashboard.routes.users.components.DashboardUsersStatCards.deletedUsers"
        )}
        value={stats?.deletedUsers}
        color="blue"
        icon={UserRoundX}
      />{" "}
      <StatCard
        label={t(
          "routes.dashboard.routes.users.components.DashboardUsersStatCards.adminUsers"
        )}
        value={stats?.admins}
        color="green"
        icon={UserCheck}
      />
    </div>
  );
};

export default memo(DashboardUsersStatCards);
