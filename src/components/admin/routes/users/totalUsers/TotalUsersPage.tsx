import { memo } from "react";
import { TotalUsersProvider } from "@/contexts/TotalUsersContext";
import SearchTotalUsers from "./SearchTotalUsers";
import TotalUsersList from "./TotalUsersList";

const TotalUsersPage = () => {
  return (
    <TotalUsersProvider>
      <SearchTotalUsers />
      <div className="w-full mt-3">
        <TotalUsersList />
      </div>
    </TotalUsersProvider>
  );
};

export default memo(TotalUsersPage);
