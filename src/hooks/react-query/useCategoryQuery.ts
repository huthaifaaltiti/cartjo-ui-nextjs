import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types/category.type";
import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";

interface FetchCategoryParams {
  lang?: Locale | string;
  categoryId: string;
}

export const fetchCategory = async ({
  lang = "en",
  categoryId,
}: FetchCategoryParams): Promise<DataResponse<Category>> => {
  const url = new URL(`${API_ENDPOINTS.CATEGORY.ONE}/${categoryId}`);

  if (lang) url.searchParams.append("lang", lang);

  const res = await fetch(url.toString(), {});

  if (!res.ok) throw new Error("Could not retrieve category");

  const resObj = await res.json();

  return resObj;
};

export const useCategoryQuery = (categoryId?: string) => {
  const { locale } = useAuthContext();

  return useQuery({
    queryKey: ["publicCategory", locale, categoryId],
    queryFn: () => fetchCategory({ lang: locale, categoryId: categoryId! }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!categoryId, // only run if id exists
  });
};
