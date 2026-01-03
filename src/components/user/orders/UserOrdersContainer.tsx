import { memo } from "react";
import SearchUserOrders from "./SearchUserOrders";
import UserOrders from "./UserOrders";

const UserOrdersContainer = () => {
  return (
    <div className="w-full h-full flex flex-col gap-5 py-2 px-1 max-h-[86vh] overflow-hidden overflow-y-scroll">
      <SearchUserOrders />
      <UserOrders />
    </div>
  );
};

export default memo(UserOrdersContainer);
