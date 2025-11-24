"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/shared/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setOrdersSearchQuery } from "@/redux/slices/orders";

const SearchOrders = () => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.orders);

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.dashboard.routes.orders.components.SearchBar.placeholder"
        )}
        searchQuery={searchQuery}
        setSearchQuery={(val) => dispatch(setOrdersSearchQuery(val))}
      />
    </div>
  );
};

export default memo(SearchOrders);
