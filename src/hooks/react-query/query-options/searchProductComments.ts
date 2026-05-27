import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Comment } from "@/types/comment.type";

export const PUBLIC_SEARCH_PRODUCT_COMMENTS_QUERY_KEY =
  "publicSearchProductComments" as const;

export const getSearchProductCommentsQueryOptions = ({
  locale,
  productId,
  queryFn,
}: {
  locale: string | Locale;
  productId: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Comment>>;
}) => {
  const getNextPageParam = (lastPage: DataListResponse<Comment>) => {
    if (!lastPage?.data?.length) return undefined;

    const lastProduct = lastPage.data[lastPage.data.length - 1];
    return lastProduct?._id || undefined;
  };

  return {
    queryKey: [PUBLIC_SEARCH_PRODUCT_COMMENTS_QUERY_KEY, locale, productId],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
  };
};
