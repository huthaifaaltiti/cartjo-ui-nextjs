import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Category } from "@/types/category.type";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";

interface FetchActiveCategoriesParams {
  lang?: Locale | string;
  fetcher: (url: string) => Promise<DataListResponse<Category>>;
}

export const fetchActiveCategories = async ({
  lang = LocaleEnum.EN,
  fetcher,
}: FetchActiveCategoriesParams): Promise<DataListResponse<Category>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.CATEGORIES.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.pathname + url.search);
};

interface FetchCategoriesPicksParams {
  lang?: Locale | string;
  limit?: number;
  categoryId: string;
  fetcher: (url: string) => Promise<DataListResponse<Product>>;
}

export const fetchCategoriesPicks = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.PRODUCTS,
  categoryId,
  fetcher,
}: FetchCategoriesPicksParams): Promise<DataListResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.HOME.PRODUCTS.CATEGORIES_PICKS}`);

  if (lang) url.searchParams.append("lang", lang);
  if (limit) url.searchParams.append("limit", limit.toString());
  if (categoryId) url.searchParams.append("categoryId", categoryId.toString());

  return fetcher(url.toString());
};
