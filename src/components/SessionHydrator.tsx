"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { hydrateSession } from "@/redux/slices/authentication";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

export default function SessionHydrator({
  initialSession,
}: {
  initialSession: CartJOSession | TokenSession | null;
}) {
  const hasHydrated = useRef(false);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (hasHydrated.current) return;

    dispatch(hydrateSession(initialSession));

    hasHydrated.current = true;
  }, [dispatch, initialSession]);

  return null;
}
