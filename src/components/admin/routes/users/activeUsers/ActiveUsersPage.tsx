import { ActiveUsersContextProvider } from "@/contexts/ActiveUsersContext";
import SearchActiveUsers from "./SearchActiveUsers";
import ActiveUsersList from "./ActiveUsersList";

const ActiveUsersPage = () => {
  return (
    <ActiveUsersContextProvider>
      <SearchActiveUsers />
      <div className="w-full mt-3">
        <ActiveUsersList />
      </div>
    </ActiveUsersContextProvider>
  );
};

export default ActiveUsersPage;
