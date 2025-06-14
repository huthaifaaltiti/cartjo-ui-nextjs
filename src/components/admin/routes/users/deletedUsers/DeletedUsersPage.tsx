import { memo } from "react";

import { DeletedUsersContextProvider } from "@/contexts/DeletedUsersContext";
import { User } from "@/types/user";

import SearchDeletedUsers from "./SearchDeletedUsers";
import DeletedUsersList from "./DeletedUsersList";

interface DeletedUsersPageProps {
  initialUsers: User[];
  accessToken: string;
}

const DeletedUsersPage = ({
  initialUsers,
  accessToken,
}: DeletedUsersPageProps) => {
  return (
    <DeletedUsersContextProvider accessToken={accessToken}>
      <SearchDeletedUsers />

      <div className="w-full mt-3">
        <DeletedUsersList initialUsers={initialUsers} />
      </div>
    </DeletedUsersContextProvider>
  );
};

export default memo(DeletedUsersPage);
