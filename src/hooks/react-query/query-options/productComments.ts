import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Comment } from "@/types/comment.type";

export const PUBLIC_PRODUCT_COMMENTS_QUERY_KEY =
  "publicProductComments" as const;

export const getProductCommentsQueryOptions = ({
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
  return {
    queryKey: ["publicProductComments", locale, productId],
    queryFn,
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
