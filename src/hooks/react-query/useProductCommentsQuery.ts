import { useInfiniteQuery } from "@tanstack/react-query";
import { DataListResponse } from "@/types/service-response.type";
import { Comment } from "@/types/comment.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { getProductCommentsQueryOptions } from "./query-options/productComments";
import { useAuthContext } from "../useAuthContext";
import { authFetcher } from "@/utils/authFetcher";
import { fetchProductComments } from "@/services/comment.service";

export const useProductCommentsQuery = (productId: string) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Comment>>({
    ...getProductCommentsQueryOptions({
      locale,
      productId,
      queryFn: ({ pageParam }) =>
        fetchProductComments({
          lang: locale ?? LocaleEnum.EN,
          productId,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.PUBLIC_VIEW.PRODUCT_COMMENTS ?? 20,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};
