import { memo } from "react";
import SearchUserOrderReturns from "./SearchUserOrderReturns";
import UserOrderReturns from "./UserOrderReturns";

const UserOrderReturnsContainer = () => {
  return (
    <div className="w-full h-full flex flex-col gap-5 py-2 px-1 max-h-[86vh] overflow-hidden overflow-y-scroll">
      <SearchUserOrderReturns />
      <UserOrderReturns />
    </div>
  );
};

export default memo(UserOrderReturnsContainer);
