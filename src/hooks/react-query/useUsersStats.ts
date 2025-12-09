import { useSession } from "next-auth/react";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";
import { useQuery } from "@tanstack/react-query";
import { UsersStats } from "@/types/UsersStats";

interface UsersStatsResp {
  isSuccess: boolean;
  message: string;
  stats: UsersStats;
}

export const fetchUsersStats = async (
  token: string
): Promise<UsersStatsResp> => {
  const res = await fetch(API_ENDPOINTS.DASHBOARD.USERS.GET_USERS_STATS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users statics");

  const resObj = await res.json();

  return resObj;
};

export const useUsersStats = () => {
  const { data: session } = useSession();

  const accessToken = (session as CustomSession)?.accessToken;

  useQuery<UsersStatsResp>({
    queryKey: ["usersStats"],
    queryFn: () => {
      if (!accessToken) throw new Error("No access token found");

      return fetchUsersStats(accessToken);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
