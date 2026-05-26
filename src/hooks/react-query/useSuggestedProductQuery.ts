import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getSuggestedProductsQueryOptions } from "./query-options/suggestedProducts";
import { fetchSuggestedProducts } from "@/services/product.service";
import { authFetcher } from "@/utils/authFetcher";

export const useSuggestedProductQuery = (
  lang: string | Locale,
  limit: number,
  productId?: string,
) => {
  const { locale } = useAuthContext();

  return useQuery({
    ...getSuggestedProductsQueryOptions({
      locale: lang,
      limit,
      productId,
      queryFn: () =>
        fetchSuggestedProducts({
          lang: locale as Locale,
          limit: PAGINATION_LIMITS.OTHERS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS ?? 4,
          productId,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};
