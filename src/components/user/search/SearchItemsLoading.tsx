import GridItemsSkeleton from "@/components/shared/loaders/GridItemsSkeleton";

const SearchItemsLoading = () => {
  return (
    <div className="w-full">
      <div className="w-full h-12 bg-gray-100 animate-pulse rounded mb-3" />
      <GridItemsSkeleton />
    </div>
  );
};

export default SearchItemsLoading;
