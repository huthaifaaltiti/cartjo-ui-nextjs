import { memo } from "react";
import UserMenu from "./UserMenu";

const UserActions = () => {
  return (
    <div className="w-auto">
      <UserMenu />
    </div>
  );
};

export default memo(UserActions);
