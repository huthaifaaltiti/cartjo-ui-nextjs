import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";
import { SubCategory } from "@/types/subCategory";

interface FetchSubCategoryProductsParams {
  lang?: string | Locale;
  categoryId: string;
  subCategoryId: string;
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

export const fetchSubCategoryProducts = async ({
  lang = LocaleEnum.EN,
  categoryId,
  subCategoryId,
  limit = PAGINATION_LIMITS.PUBLIC_SUB_CATEGORY_PRODUCTS_ITEMS,
  lastId,
  priceFrom,
  priceTo,
  ratingFrom,
  createdFrom,
  createdTo,
  beforeNumOfDays,
  fetcher,
}: FetchSubCategoryProductsParams): Promise<DataListResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.SUB_CATEGORY.PRODUCTS}`);

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

  return fetcher(url.toString());
};

interface FetchSubCategoriesParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  catId?: string;
  fetcher: (url: string) => Promise<DataListResponse<SubCategory>>;
}

export const fetchSubCategories = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.DASHBOARD_VIEW.SUB_CATEGORIES ?? 20,
  lastId,
  search,
  catId,
  fetcher,
}: FetchSubCategoriesParams): Promise<DataListResponse<SubCategory>> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.GET_ALL);

  if (limit) url.searchParams.append("limit", limit.toString());
  if (lastId) url.searchParams.append("lastId", lastId.toString());
  if (search) url.searchParams.append("search", search.toString());
  if (lang) url.searchParams.append("lang", lang.toString());
  if (catId) url.searchParams.append("catId", catId.toString());

  return fetcher(url.toString());
};
