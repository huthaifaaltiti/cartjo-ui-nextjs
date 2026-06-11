import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
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

interface FetchCategoryParams {
  lang?: Locale | string;
  categoryId: string | undefined;
  fetcher: (url: string) => Promise<DataResponse<Category>>;
}

export const fetchCategory = async ({
  lang = "en",
  categoryId,
  fetcher,
}: FetchCategoryParams): Promise<DataResponse<Category>> => {
  const url = new URL(`${API_ENDPOINTS.CATEGORY.ONE}/${categoryId}`);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString());
};

interface FetchCategoryProductsParams {
  lang?: string | Locale;
  categoryId: string;
  limit?: number;
  lastId?: string;
  priceFrom?: number;
  priceTo?: number;
  ratingFrom?: number;
  createdFrom?: string;
  createdTo?: string;
  beforeNumOfDays?: number;
  fetcher: (url: string) => Promise<DataListResponse<Product>>;
}

export const fetchCategoryProducts = async ({
  lang = "en",
  categoryId,
  limit = PAGINATION_LIMITS.PUBLIC_CATEGORY_PRODUCTS_ITEMS,
  lastId,
  priceFrom,
  priceTo,
  ratingFrom,
  createdFrom,
  createdTo,
  beforeNumOfDays,
  fetcher,
}: FetchCategoryProductsParams): Promise<DataListResponse<Product>> => {
  const url = new URL(API_ENDPOINTS.CATEGORY.PRODUCTS);

  if (!categoryId) {
    throw new Error("No category id found");
  }

  if (lang) url.searchParams.append("lang", lang);
  if (categoryId) url.searchParams.append("categoryId", categoryId);
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

  return fetcher(url.toString());
};

interface FetchCategoriesParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataListResponse<Category>>;
}

export const fetchCategories = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.DASHBOARD_VIEW.CATEGORIES ?? 20,
  lastId,
  search,
  fetcher,
}: FetchCategoriesParams): Promise<DataListResponse<Category>> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.CATEGORIES.GET_ALL);

  url.searchParams.append("limit", limit.toString());

  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
