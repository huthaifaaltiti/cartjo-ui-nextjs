import { QueryClient } from "@tanstack/react-query";
import { prefetchUsersStats } from "../usersStats";
import { prefetchActiveUsers } from "../activeUsers";
import { prefetchTotalUsers } from "../totalUsers";
import { prefetchAdminUsers } from "../adminUsers";

export async function prefetchDashboardUsersData({
  locale,
  queryClient,
}: {
  locale: string;
  queryClient: QueryClient;
}) {
  await Promise.all([
    prefetchUsersStats({ queryClient, locale }),
    prefetchActiveUsers({ queryClient, locale }),
    prefetchTotalUsers({ queryClient, locale }),
    prefetchAdminUsers({ queryClient, locale }),
  ]);
}
