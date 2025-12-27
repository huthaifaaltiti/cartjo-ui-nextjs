import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getAccessTokenFromServerSession,
  getUserServerSession,
} from "@/lib/serverSession";
import { getQueryClient } from "@/utils/queryUtils";
import { DataListResponse } from "@/types/service-response.type";
import { getUserOrdersQueryOptions } from "@/utils/queryOptions";
import { redirect } from "next/navigation";
import { Order } from "@/types/order.type";
import { Locale } from "@/types/locale";
import UserOrdersContainer from "@/components/user/orders/UserOrdersContainer";

interface PageProps {
  params: Promise<{
    locale: Locale | string;
    category: string;
    subCategory: string;
  }>;
}

const UserOrdersPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  
  const token = await getAccessTokenFromServerSession();
  if (!token) redirect("/auth");

  const session = await getUserServerSession();
  const uid = session?.user?.id ?? null;

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery<Promise<DataListResponse<Order>>>(
    getUserOrdersQueryOptions(locale, token, uid)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UserOrdersContainer />
    </HydrationBoundary>
  );
};

export default UserOrdersPage;
