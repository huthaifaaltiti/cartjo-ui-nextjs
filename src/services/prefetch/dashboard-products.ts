import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/types/locale";
import { prefetchAdminActiveCategories } from "./activeCategories";
import { prefetchAdminProducts } from "./products";

type PrefetchDashboardProductsProps = {
  queryClient: QueryClient;
  locale: Locale | string;
};

export async function prefetchDashboardProducts({
  queryClient,
  locale,
}: PrefetchDashboardProductsProps) {
  await Promise.all([
    prefetchAdminProducts({ queryClient, locale }),
    prefetchAdminActiveCategories({ queryClient, locale }),
  ]);
}
