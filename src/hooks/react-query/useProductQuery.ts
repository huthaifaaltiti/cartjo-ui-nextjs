import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { getProductQueryOptions } from "./query-options/product";
import { fetchProduct } from "@/services/product.service";
import { authFetcher } from "@/utils/authFetcher";

export const useProductQuery = ({ productId }: { productId: string }) => {
  const { locale } = useAuthContext();

  return useQuery({
    ...getProductQueryOptions({
      locale,
      productId,
      queryFn: () =>
        fetchProduct({
          lang: locale as Locale,
          productId,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};
