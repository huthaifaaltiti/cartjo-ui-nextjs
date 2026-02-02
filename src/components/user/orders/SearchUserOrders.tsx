"use client";

import { memo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { setOrdersSearchQuery } from "@/redux/slices/orders";
import SearchBar from "@/components/shared/SearchBar";

const SearchUserOrders = () => {
  const t = useTranslations();
  const dispatch = useDispatch<AppDispatch>();
  const { searchQuery, items } = useSelector(
    (state: RootState) => state.orders,
  );

  const [sq, setSq] = useQueryState("sq", {
    defaultValue: "",
    parse: (value) => String(value),
  });

  useEffect(() => {
    if (sq) {
      dispatch(setOrdersSearchQuery(sq));
    }
  }, [sq, dispatch]);

  useEffect(() => {
    setSq(searchQuery);
  }, [searchQuery, sq, setSq]);

  return (
    <div className="w-full px-2 md:px-0">
      <SearchBar
        placeholder={t(
          "routes.user.layout.routes.orders.components.SearchUserOrders.placeholder",
        )}
        searchQuery={searchQuery || sq}
        setSearchQuery={(val) => dispatch(setOrdersSearchQuery(val))}
        disabled={items.length < 10}
      />
    </div>
  );
};

export default memo(SearchUserOrders);
