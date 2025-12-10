import { memo } from "react";
import { User } from "@/types/user";
import { TotalUsersProvider } from "@/contexts/TotalUsersContext";
import SearchTotalUsers from "./SearchTotalUsers";
import TotalUsersList from "./TotalUsersList";

interface TotalUsersPageProps {
  initialUsers: User[];
  accessToken: string | null;
}

const TotalUsersPage = ({ initialUsers, accessToken }: TotalUsersPageProps) => {
  return (
    <TotalUsersProvider accessToken={accessToken}>
      <SearchTotalUsers />
      <div className="w-full mt-3">
        <TotalUsersList initialUsers={initialUsers} />
      </div>
    </TotalUsersProvider>
  );
};

export default memo(TotalUsersPage);
