"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { hydrateSession } from "@/redux/slices/authentication";
import { CartJOSession } from "@/lib/session.server";

export default function SessionHydrator({
  initialSession,
}: {
  initialSession: CartJOSession | null;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateSession(initialSession));
  }, []);

  return null;
}
