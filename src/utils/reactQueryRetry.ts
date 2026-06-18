interface RetryConfig {
  maxRetries?: number;
  excludedStatusCodes?: number[];
}

interface ApiError {
  status?: number;
  message?: string;
}

export const createRetryHandler = ({
  maxRetries = 3,
  excludedStatusCodes = [401, 403],
}: RetryConfig = {}) => {
  return (failureCount: number, error: ApiError) => {
    const status = error?.status;

    if (status && excludedStatusCodes.includes(status)) {
      return false;
    }

    return failureCount < maxRetries;
  };
};
