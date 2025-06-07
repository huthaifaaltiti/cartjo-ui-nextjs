import { memo } from "react";

import DashboardUsersStatCards from "./DashboardUsersStatCards";
import DashboardUsersStatCardsLinks from "./DashboardUsersStatCardsLinks";

import { UsersStats } from "@/types/UsersStats";

type UsersPageContainerProps = {
  stats: UsersStats;
};

const UsersPageContainer = ({ stats }: UsersPageContainerProps) => {
  return (
    <div className="w-full h-full p-3">
      <div className="w-full border-b">
        <DashboardUsersStatCards stats={stats} />
        <DashboardUsersStatCardsLinks />
      </div>
    </div>
  );
};

export default memo(UsersPageContainer);
