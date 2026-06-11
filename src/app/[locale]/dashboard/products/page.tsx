import ProductsPage from "@/components/admin/routes/products/ProductsPage";
import { requireAuth } from "@/utils/authRedirect";
import { getAccessToken } from "@/lib/tokens.server";
import { getQueryClient } from "@/utils/queryUtils";
import { PageProps } from "@/types/common";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { prefetchDashboardProducts } from "@/services/prefetch/dashboard-products";

export default async function DashboardProductsPage({ params }: PageProps) {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await prefetchDashboardProducts({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductsPage />
    </HydrationBoundary>
  );
}
