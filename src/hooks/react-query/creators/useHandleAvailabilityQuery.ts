"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { checkHandleAvailability } from "@/services/creators/creatorStore.service";
import { HandleAvailabilityData } from "@/types/creators/creatorStore";
import { DataResponse } from "@/types/service-response.type";

import { validationConfig } from "@/config/validationConfig";

export const HANDLE_FORMAT_REGEX = /^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])$/;

export const isValidHandleFormat = (handle: string): boolean => {
  const { handleMinChars, handleMaxChars } = validationConfig.creatorStore;
  if (
    !handle ||
    handle.length < handleMinChars ||
    handle.length > handleMaxChars
  )
    return false;
  return HANDLE_FORMAT_REGEX.test(handle);
};

interface UseHandleAvailabilityQueryProps {
  handle: string;
  enabled?: boolean;
  currentHandle?: string;
  debounceMs?: number;
}

export const useHandleAvailabilityQuery = ({
  handle,
  enabled = true,
  currentHandle = "",
  debounceMs = 400,
}: UseHandleAvailabilityQueryProps) => {
  const locale = useLocale();
  const cleanHandle = handle.toLowerCase().trim();
  const cleanCurrentHandle = currentHandle.toLowerCase().trim();

  const [debouncedHandle, setDebouncedHandle] = useState<string>(cleanHandle);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  useEffect(() => {
    if (cleanHandle === debouncedHandle) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedHandle(cleanHandle);
      setIsDebouncing(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [cleanHandle, debouncedHandle, debounceMs]);

  const isFormatValid: boolean = isValidHandleFormat(debouncedHandle);
  const isSameAsCurrent: boolean =
    Boolean(cleanCurrentHandle) && debouncedHandle === cleanCurrentHandle;
  const shouldQuery =
    enabled && Boolean(debouncedHandle) && isFormatValid && !isSameAsCurrent;

  const query = useQuery<DataResponse<HandleAvailabilityData>, Error>({
    queryKey: ["creatorStore", "handleAvailability", debouncedHandle, locale],
    queryFn: ({ signal }) =>
      checkHandleAvailability({
        handle: debouncedHandle,
        lang: locale,
        signal,
      }),
    enabled: shouldQuery,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  return {
    ...query,
    isDebouncing,
    debouncedHandle,
    isFormatValid,
    isSameAsCurrent,
  };
};
