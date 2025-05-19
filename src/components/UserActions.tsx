import { memo } from "react";
import UserMenu from "./UserMenu";

const UserActions = () => {
  return (
    <div className="w-full">
      <UserMenu />
    </div>
  );
};

export default memo(UserActions);
