import { memo } from "react";

import { AdminUsersContextProvider } from "@/contexts/AdminUsersContext";

import { User } from "@/types/user";

import SearchAdminUsers from "./SearchAdminUsers";
import AdminUsersList from "./AdminUsersList";
import CreateAdminUserBtn from "./CreateAdminUserBtn";

interface AdminUsersPageProps {
  initialUsers: User[];
  accessToken: string;
}

const AdminUsersPage = ({ initialUsers, accessToken }: AdminUsersPageProps) => {
  return (
    <AdminUsersContextProvider accessToken={accessToken}>
      <CreateAdminUserBtn />
      <SearchAdminUsers />

      <div className="w-full mt-3">
        <AdminUsersList initialUsers={initialUsers} />
      </div>
    </AdminUsersContextProvider>
  );
};

export default memo(AdminUsersPage);
