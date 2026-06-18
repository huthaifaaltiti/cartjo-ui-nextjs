import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/types/locale";
import { prefetchAdminSubCategories } from "./subCategories";
import { prefetchAdminCategories } from "./categories";
import { prefetchAdminActiveCategories } from "./activeCategories";

type PrefetchDashboardProductsProps = {
  queryClient: QueryClient;
  locale: Locale | string;
};

export async function prefetchDashboardSubCategories({
  queryClient,
  locale,
}: PrefetchDashboardProductsProps) {
  await Promise.all([
    prefetchAdminSubCategories({ queryClient, locale }),
    prefetchAdminCategories({ queryClient, locale }),
    prefetchAdminActiveCategories({ queryClient, locale }),
  ]);
}
