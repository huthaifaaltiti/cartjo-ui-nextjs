import { Locale } from "@/types/locale";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { prefetchCreatorStoreData } from "@/services/prefetch/creators/creatorStore";
import EditCreatorStoreForm from "@/components/creators/store/EditCreatorStoreForm";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const EditCreatorStorePage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchCreatorStoreData({ queryClient, locale }).catch((e) =>
    console.error("[prefetchCreatorStoreData]", e),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EditCreatorStoreForm />
    </HydrationBoundary>
  );
};

export default EditCreatorStorePage;
