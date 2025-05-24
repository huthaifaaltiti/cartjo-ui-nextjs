import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useQuery } from "@tanstack/react-query";

export interface Location {
  name: {
    ar: string;
    en: string;
  };
  price: string;
  subLocations: Location[];
}

interface LocationsResponse {
  isSuccess: boolean;
  message: string;
  locations: Location[];
}

const fetchLocations = async (): Promise<LocationsResponse> => {
  const res = await fetch(API_ENDPOINTS.DASHBOARD.LOCATIONS.GET_LOCATIONS);

  if (!res.ok) throw new Error("Failed to fetch locations"); //status >= 200 && status < 300

  const jsonRes = await res.json();

  return jsonRes;
};

export const useLocations = () =>
  useQuery<LocationsResponse>({
    queryKey: ["dashboardLocations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 5, // 5 minutes //controls how long the data is considered "fresh", During this period, React Query won't re-fetch the data if the component is remounted or re-rendered
    gcTime: 1000 * 60 * 10, // 10 minutes // gcTime (garbage collection time, formerly cacheTime) determines how long unused/inactive data stays in memory before being removed. After 10 minutes of inactivity (no subscribers), the cached data is deleted.
  });
