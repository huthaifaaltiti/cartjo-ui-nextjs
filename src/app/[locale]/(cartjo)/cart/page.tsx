import {
  dehydrate,
  HydrationBoundary,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import CartItems from "@/components/user/cart/CartItems";
import { Cart } from "@/types/cart.type";
import { getCartQueryOptions } from "@/hooks/react-query/query-options/cart";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { Locale } from "@/types/locale";
import { fetchCartItems } from "@/services/cart.service";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { apiFetch } from "@/lib/api.server";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery<DataResponse<Cart>>(
    getCartQueryOptions({
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchCartItems({
          lang: locale ?? LocaleEnum.EN,
          limit: PAGINATION_LIMITS.USER_VIEW.CART_ITEMS ?? 20,
          lastId: context.pageParam as string | undefined,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataResponse<Cart>>(path);

            if (!ok || !data) {
              throw new Error(
                `[UserCartPage] Failed to fetch cart items: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CartItems />
    </HydrationBoundary>
  );
};

export default Page;
