import { memo } from "react";
import { DeletedUsersContextProvider } from "@/contexts/DeletedUsersContext";
import SearchDeletedUsers from "./SearchDeletedUsers";
import DeletedUsersList from "./DeletedUsersList";

const DeletedUsersPage = () => {
  return (
    <DeletedUsersContextProvider>
      <SearchDeletedUsers />
      <div className="w-full mt-3">
        <DeletedUsersList />
      </div>
    </DeletedUsersContextProvider>
  );
};

export default memo(DeletedUsersPage);
