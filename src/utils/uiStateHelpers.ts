import { FetchError } from "@/types/common";

export interface QueryUIStateParams<T> {
  data?: T | null;
  isLoading: boolean;
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
  error?: FetchError | null;
  isSuccess?: boolean;
}

export interface QueryUIState {
  showLoader: boolean;
  showError: boolean;
  showNoData: boolean;
  showData: boolean;
}

export function getQueryUIState<T>({
  data,
  isLoading,
  isFetching,
  isFetched,
  isError,
  error,
  isSuccess,
}: QueryUIStateParams<T>): QueryUIState {
  const notFoundItem = error && (error as FetchError).status === 404;

  const showLoader =
    (!isLoading && !isFetching && !isFetched && !isError && !isSuccess) ||
    isLoading ||
    isFetching;

  const showError = isFetched && isError && !data && !notFoundItem;

  const showNoData = !!((!showLoader && !showError && !data) || notFoundItem);

  const showData = !showLoader && !showError && !!data;

  return { showLoader, showError, showNoData, showData };
}
