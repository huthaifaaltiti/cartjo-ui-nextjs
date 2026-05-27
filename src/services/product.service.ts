import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";

interface FetchSearchProductsParams {
  querySearch: string | undefined;
  lang?: string | Locale;
  categoryId?: string | undefined;
  subCategoryId?: string | undefined;
  limit?: number;
  lastId?: string;
  priceFrom?: number;
  priceTo?: number;
  ratingFrom?: number;
  createdFrom?: string;
  createdTo?: string;
  beforeNumOfDays?: number;
  typeHint?: string | undefined;
  fetcher: (url: string) => Promise<DataListResponse<Product>>;
}

export const fetchSearchProducts = async ({
  querySearch,
  lang = LocaleEnum.EN,
  categoryId,
  subCategoryId,
  limit = PAGINATION_LIMITS.PUBLIC_VIEW.PUBLIC_SEARCH_PAGE_PRODUCTS_ITEMS ?? 20,
  lastId,
  priceFrom,
  priceTo,
  ratingFrom,
  createdFrom,
  createdTo,
  beforeNumOfDays,
  typeHint,
  fetcher,
}: FetchSearchProductsParams): Promise<DataListResponse<Product>> => {
  const url = new URL(API_ENDPOINTS.SEARCH.PRODUCTS);

  if (querySearch) url.searchParams.append("q", querySearch);
  if (lang) url.searchParams.append("lang", lang);
  if (categoryId) url.searchParams.append("categoryId", categoryId);
  if (subCategoryId) url.searchParams.append("subCategoryId", subCategoryId);
  if (limit) url.searchParams.append("limit", String(limit));
  if (lastId) url.searchParams.append("lastId", lastId);
  if (priceFrom !== undefined && priceFrom > 0)
    url.searchParams.append("priceFrom", String(priceFrom));
  if (priceTo !== undefined && priceTo > 0)
    url.searchParams.append("priceTo", String(priceTo));
  if (ratingFrom !== undefined && ratingFrom > 0)
    url.searchParams.append("ratingFrom", String(ratingFrom));
  if (createdFrom !== undefined && createdFrom)
    url.searchParams.append("createdFrom", String(createdFrom));
  if (createdTo !== undefined && createdTo)
    url.searchParams.append("createdTo", String(createdTo));
  if (beforeNumOfDays !== undefined && beforeNumOfDays > 0)
    url.searchParams.append("beforeNumOfDays", String(beforeNumOfDays));
  if (typeHint) url.searchParams.append("typeHint", typeHint);

  return fetcher(url.toString());
};

interface FetchSuggestedProductsProps {
  lang?: Locale | string;
  limit?: number;
  productId?: string;
  fetcher: (url: string) => Promise<DataListResponse<Product>>;
}

export const fetchSuggestedProducts = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.OTHERS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS ?? 4,
  productId,
  fetcher,
}: FetchSuggestedProductsProps): Promise<DataListResponse<Product>> => {
  const url = new URL(API_ENDPOINTS.PRODUCT.SUGGESTED);

  if (lang) url.searchParams.append("lang", lang.toString());
  if (limit) url.searchParams.append("limit", limit.toString());
  if (productId) url.searchParams.append("mainProductId", productId.toString());

  return fetcher(url.toString());
};

interface FetchProductProps {
  lang?: Locale | string;
  productId: string;
  fetcher: (url: string) => Promise<DataResponse<Product>>;
}

export const fetchProduct = async ({
  lang = LocaleEnum.EN,
  productId,
  fetcher,
}: FetchProductProps): Promise<DataResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.PRODUCT.ONE}/${productId}`);
  if (lang) url.searchParams.append("lang", lang.toString());

  return fetcher(url.toString());
};
