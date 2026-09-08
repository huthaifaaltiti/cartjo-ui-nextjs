import { memo } from "react";
import UserMenu from "./UserMenu";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

interface UserActionsProps {
  initialSession?: CartJOSession | TokenSession | null;
}

const UserActions = ({ initialSession }: UserActionsProps) => {
  return (
    <div className="w-auto">
      <UserMenu initialSession={initialSession} />
    </div>
  );
};

export default memo(UserActions);
