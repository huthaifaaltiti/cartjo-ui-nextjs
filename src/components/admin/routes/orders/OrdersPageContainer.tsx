import { memo } from "react";
import OrdersList from "./OrdersList";
import SearchOrders from "./SearchOrders";

const OrdersPageContainer = () => {
  return (
    <div className="flex flex-col gap-3">
      <SearchOrders />
      <OrdersList />
    </div>
  );
};

export default memo(OrdersPageContainer);
