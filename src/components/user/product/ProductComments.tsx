import { memo, useMemo } from "react";
import { useProductCommentsQuery } from "@/hooks/react-query/useProductCommentsQuery";
import { getQueryUIState } from "@/utils/uiStateHelpers";
import ProductCommentCard from "./ProductCommentCard";
import ProductCommentsLoading from "./ProductCommentsLoading";
import ProdCommentsHeader from "./ProdCommentsHeader";
import ProdCommentsErr from "./ProdCommentsErr";
import NoProdComments from "./NoProdComments";
import InfiniteScrollList from "@/components/shared/InfiniteScrollList";
import AddComment from "./AddComment";
import ProductAddCommentLoading from "./ProductAddCommentLoading";

const ProductComments = ({ productId }: { productId: string }) => {
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isFetched,
    isError,
    error,
    refetch,
  } = useProductCommentsQuery(productId, "en");

  const comments = useMemo(() => {
    const pages = data?.pages || [];
    return pages.flatMap((page) => page?.data || []);
  }, [data]);

  const { showLoader, showError, showNoData, showData } = getQueryUIState({
    data: comments.length > 0 ? comments : null,
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
    isSuccess: data?.pages[0]?.isSuccess ?? false,
  });

  const containerClass =
    "w-full max-w-7xl mx-auto border-t border-gray-200/20 py-8";
  const scrollContainerClass =
    "min-h-[400px] max-h-[800px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <ProdCommentsHeader />
        <div className={scrollContainerClass}>
          <ProductAddCommentLoading />
          <ProductCommentsLoading />
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <div className={scrollContainerClass}>
          <ProdCommentsErr msg={error!.message} />
        </div>
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <ProdCommentsHeader />
        <div className={scrollContainerClass}>
          <AddComment productId={productId} refetch={refetch} />
          <NoProdComments />
        </div>
      </div>
    );
  }

  if (showData) {
    const avgRating =
      comments.reduce((acc, c) => acc + (c.rating || 0), 0) /
      comments.filter((c) => c.rating).length;
    const ratingCount = comments.filter((c) => c.rating !== null).length;

    return (
      <div className={containerClass}>
        <ProdCommentsHeader
          showRating={ratingCount > 0}
          avgRating={avgRating}
          ratingCount={ratingCount}
        />

        <AddComment productId={productId} refetch={refetch} />

        <div className={scrollContainerClass}>
          <InfiniteScrollList
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            error={error}
            list={comments}
            fetchNextPage={fetchNextPage}
            ListItemCard={ProductCommentCard}
            cardProps={{
              refetch,
            }}
            layout="list"
            showNumFoundItems={false}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default memo(ProductComments);
