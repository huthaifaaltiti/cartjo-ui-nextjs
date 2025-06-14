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
