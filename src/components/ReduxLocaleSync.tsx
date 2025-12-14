"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { setLocale } from "@/redux/slices/general";
import { Locale } from "@/types/locale";

export default function ReduxLocaleSync() {
  const locale = useLocale();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocale(locale as Locale));
  }, [locale, dispatch]);

  return null;
}
