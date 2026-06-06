import { QueryClient, QueryFunctionContext } from "@tanstack/react-query";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Cart } from "@/types/cart.type";
import { getCartQueryOptions } from "@/hooks/react-query/query-options/cart";
import { fetchCartItems } from "../cart.service";

export async function prefetchCartData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
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
              throw new Error(`Failed to fetch cart items: ${status}`);
            }
            return data;
          },
        }),
    }),
  );
}
