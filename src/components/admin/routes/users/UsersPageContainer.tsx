import { memo } from "react";

import { UsersStats } from "@/types/UsersStats";
import DashboardUsersStatCards from "./DashboardUsersStatCards";

type UsersPageContainerProps = {
  stats: UsersStats;
};

const UsersPageContainer = ({ stats }: UsersPageContainerProps) => {
  return (
    <div className="w-full h-full p-3 ">
      <DashboardUsersStatCards stats={stats} />
    </div>
  );
};

export default memo(UsersPageContainer);
