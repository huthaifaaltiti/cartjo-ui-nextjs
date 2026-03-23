"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "@/redux/slices/category";
import { useActiveCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";

export default function ReduxInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { data: categoriesResult } = useActiveCategoriesQuery();

  useEffect(() => {
    const categories = categoriesResult?.data ?? [];

    if (categories.length > 0) {
      dispatch(setCategories(categories));
    }
  }, [categoriesResult]);
  return <>{children}</>;
}
