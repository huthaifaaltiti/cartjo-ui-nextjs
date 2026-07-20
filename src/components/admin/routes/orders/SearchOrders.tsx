"use client";

import { memo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setOrdersSearchQuery } from "@/redux/slices/orders";
import SearchBar from "@/components/shared/SearchBar";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";

const SearchOrders = () => {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const { searchQuery } = useSelector((state: RootState) => state.orders);

  const { canReadOrder } = usePermission({
    canReadOrder: Permission.ORDERS_READ,
  });

  const [id, setId] = useQueryState("id", {
    defaultValue: "",
    parse: (value) => String(value),
  });

  useEffect(() => {
    if (id) {
      dispatch(setOrdersSearchQuery(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    setId(searchQuery);
  }, [searchQuery, id, setId]);

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.orders.components.SearchBar.placeholder",
        )}
        searchQuery={searchQuery || id}
        setSearchQuery={(val) => dispatch(setOrdersSearchQuery(val))}
        disabled={!canReadOrder}
      />
    </div>
  );
};

export default memo(SearchOrders);
