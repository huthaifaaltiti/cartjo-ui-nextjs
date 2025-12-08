import { useQuery } from "@tanstack/react-query";

import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Location } from "@/types/location";

export interface LocationsResponse {
  isSuccess: boolean;
  message: string;
  locations: Location[];
}

export const fetchLocations = async (): Promise<LocationsResponse> => {
  const res = await fetch(API_ENDPOINTS.DASHBOARD.LOCATIONS.GET_LOCATIONS);

  //status >= 200 && status < 300 => Res is ok
  if (!res.ok) throw new Error("Failed to fetch locations");

  const jsonRes = await res.json();

  return jsonRes;
};

export const useLocations = () =>
  useQuery<LocationsResponse>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    /* 
      Controls how long the data is considered "fresh", During this period, React Query won't re-fetch the data if the component is remounted or re-rendered
    */
    staleTime: STALE_TIME,
    /*
    gcTime (garbage collection time, formerly cacheTime) determines how long unused/inactive data stays in memory before being removed. After 10 minutes of inactivity (no subscribers), the cached data is deleted.
    */
    gcTime: GC_TIME, // 10 minutes
  });
