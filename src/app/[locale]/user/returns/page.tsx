import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getAccessTokenFromServerSession,
  getUserServerSession,
} from "@/lib/serverSession";
import { getQueryClient } from "@/utils/queryUtils";
import { DataListResponse } from "@/types/service-response.type";
import { getUserOrderReturnsQueryOptions } from "@/utils/queryOptions";
import { redirect } from "next/navigation";
import { Order } from "@/types/order.type";
import { Locale } from "@/types/locale";
import UserOrderReturnsContainer from "@/components/user/returns/UserOrderReturnsContainer";

interface PageProps {
  params: Promise<{
    locale: Locale | string;
  }>;
}

const UserOrdersReturnsPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessTokenFromServerSession();
  if (!token) redirect("/auth");

  const session = await getUserServerSession();
  const uid = session?.user?.id ?? null;

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery<Promise<DataListResponse<Order>>>(
    getUserOrderReturnsQueryOptions(locale, token, uid)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UserOrderReturnsContainer />
    </HydrationBoundary>
  );
};

export default UserOrdersReturnsPage;
