import { useInfiniteQuery } from "@tanstack/react-query";
import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { fetcher } from "@/utils/fetcher";
import { Comment } from "@/types/comment.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

interface FetchProductCommentsProps {
  lang?: Locale | string;
  limit?: number;
  lastId?: string;
  productId: string;
}

export const getProductCommentsQueryOptions = (
  locale: string,
  productId: string,
) => {
  return {
    queryKey: ["publicProductComments", locale, productId],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      if (!productId) throw new Error("No productId found");

      return fetchProductComments({
        lang: locale,
        limit: PAGINATION_LIMITS.PUBLIC_PRODUCT_COMMENTS_ITEMS,
        lastId: typeof pageParam === "string" ? pageParam : undefined,
        productId,
      });
    },
    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage: DataListResponse<Comment>) => {
      if (!lastPage?.data?.length) return undefined;

      const lastComment = lastPage.data[lastPage.data.length - 1];
      return lastComment?._id;
    },

    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
  };
};

export const fetchProductComments = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.PUBLIC_PRODUCT_COMMENTS_ITEMS,
  lastId,
  productId,
}: FetchProductCommentsProps): Promise<DataListResponse<Comment>> => {
  const url = new URL(API_ENDPOINTS.PRODUCT.COMMENTS);

  if (lang) url.searchParams.append("lang", lang.toString());
  if (productId) url.searchParams.append("productId", productId.toString());
  if (limit) url.searchParams.append("limit", limit.toString());
  if (lastId) url.searchParams.append("lastId", lastId);

  return fetcher<DataListResponse<Comment>>(url, {});
};

export const useProductCommentsQuery = (
  productId: string,
  lang?: Locale | string,
) => {
  return useInfiniteQuery<DataListResponse<Comment>>(
    getProductCommentsQueryOptions(lang || LocaleEnum.EN, productId),
  );
};
