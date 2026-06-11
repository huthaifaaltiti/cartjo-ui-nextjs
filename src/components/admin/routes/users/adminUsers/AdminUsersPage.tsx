import { memo } from "react";
import { AdminUsersContextProvider } from "@/contexts/AdminUsersContext";
import SearchAdminUsers from "./SearchAdminUsers";
import AdminUsersList from "./AdminUsersList";
import CreateAdminUserBtn from "./CreateAdminUserBtn";

const AdminUsersPage = () => {
  return (
    <AdminUsersContextProvider>
      <CreateAdminUserBtn />
      <SearchAdminUsers />
      <div className="w-full mt-3">
        <AdminUsersList />
      </div>
    </AdminUsersContextProvider>
  );
};

export default memo(AdminUsersPage);
