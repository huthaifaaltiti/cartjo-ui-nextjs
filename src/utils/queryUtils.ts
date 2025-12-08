import { QueryClient } from "@tanstack/react-query";

/**
 * General function to invalidate queries
 * @param queryClient - The QueryClient instance
 * @param queryKeys - Array of query keys to invalidate
 * @returns Promise<void>
 */
export const invalidateQueries = async (
  queryClient: QueryClient,
  queryKeys: string[]
): Promise<void> => {
  const invalidationPromises = queryKeys.map((queryKey) =>
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  );

  await Promise.all(invalidationPromises);
};

/**
 * Alternative: Single query key invalidation
 * @param queryClient - The QueryClient instance
 * @param queryKey - Single query key to invalidate
 * @returns Promise<void>
 */
export const invalidateQuery = async (
  queryClient: QueryClient,
  queryKey: string
): Promise<void> => {
  await queryClient.invalidateQueries({ queryKey: [queryKey] });
};

let client: QueryClient | null = null;

export const getQueryClient = () => {
  // Always create a fresh client on the server
  if (typeof window === "undefined") {
    return new QueryClient();
  }

  // Reuse client on the client (singleton)
  if (!client) {
    client = new QueryClient();
  }

  return client;
};
