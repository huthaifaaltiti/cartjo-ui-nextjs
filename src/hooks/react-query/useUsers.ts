import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { User } from "@/types/user";
import { CustomSession } from "@/lib/authOptions";

export interface UsersResponse {
  isSuccess: boolean;
  message: string;
  users: User[];
}

export const fetchUsers = async (token: string): Promise<UsersResponse> => {
  const res = await fetch(API_ENDPOINTS.DASHBOARD.USERS.GET_USERS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  const resJson = await res.json();
  return resJson;
};

export const useUsers = () => {
  const { data: session } = useSession();

  const accessToken = (session as CustomSession)?.accessToken;

  return useQuery<UsersResponse>({
    queryKey: ["users"],
    queryFn: () => {
      if (!accessToken) throw new Error("No access token found");

      return fetchUsers(accessToken);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
