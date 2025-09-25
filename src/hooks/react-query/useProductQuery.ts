import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { FetchError } from "@/types/common";
import { fetcher } from "@/utils/fetcher";

interface FetchProductProps {
  token?: string;
  lang?: Locale | string;
  productId: string;
}

// export const fetchProduct = async ({
//   token,
//   lang = "en",
//   productId,
// }: FetchProductProps): Promise<DataResponse<Product>> => {
//   const url = new URL(`${API_ENDPOINTS.PRODUCT.ONE}/${productId}`);

//   if (lang) url.searchParams.append("lang", lang.toString());

//   const resp = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const respObj = await resp.json();

//   if (!resp.ok) {
//     const err: any = new Error(respObj?.message || "Request failed");
//     err.status = resp.status;
//     err.details = respObj;
//     throw err;
//   }

//   return respObj;
// };

export const fetchProduct = async ({
  token,
  lang = "en",
  productId,
}: FetchProductProps): Promise<DataResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.PRODUCT.ONE}/${productId}`);
  if (lang) url.searchParams.append("lang", lang.toString());

  return fetcher<DataResponse<Product>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useProductQuery = ({
  lang = "en",
  productId,
}: Pick<FetchProductProps, "lang" | "productId">) => {
  const { locale, accessToken } = useAuthContext();

  return useQuery({
    queryKey: ["publicProduct", lang, productId],
    queryFn: () =>
      fetchProduct({
        token: accessToken,
        lang: lang || locale,
        productId: productId!,
      }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
    retry: (failureCount, error) => {
      const err = error as FetchError;
      if (err?.status === 404) return false;
      return failureCount < 2; // Only retry up to 2 times for other errors
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
