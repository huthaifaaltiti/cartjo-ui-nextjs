import { memo } from "react";

import { User } from "@/types/user";
import { ActiveUsersContextProvider } from "@/contexts/ActiveUsersContext";

import SearchActiveUsers from "./SearchActiveUsers";
import ActiveUsersList from "./ActiveUsersList";

interface ActiveUsersPageProps {
  initialUsers: User[];
  accessToken: string;
}

const ActiveUsersPage = ({
  initialUsers,
  accessToken,
}: ActiveUsersPageProps) => {
  return (
    <ActiveUsersContextProvider accessToken={accessToken}>
      <SearchActiveUsers />

      <div className="w-full mt-3">
        <ActiveUsersList initialUsers={initialUsers} />
      </div>
    </ActiveUsersContextProvider>
  );
};

export default memo(ActiveUsersPage);
