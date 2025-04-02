
import { QueryClient } from "@tanstack/react-query";

/**
 * Default cache times in milliseconds
 */
export const CACHE_TIMES = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
};

/**
 * Helper to prefetch and populate the query cache
 */
export const prefetchQuery = async <T>(
  queryClient: QueryClient,
  queryKey: any[],
  queryFn: () => Promise<T>,
  options = { staleTime: CACHE_TIMES.MEDIUM }
) => {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: options.staleTime,
  });
};

/**
 * Helper to invalidate multiple related queries at once
 */
export const invalidateRelatedQueries = (
  queryClient: QueryClient,
  queryKeys: any[][]
) => {
  return Promise.all(
    queryKeys.map(key => queryClient.invalidateQueries({ queryKey: key }))
  );
};

/**
 * Debounce function to prevent excessive function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Helper to create stable memoized selector functions
 */
export const createSelector = <T, R>(
  input: T,
  selector: (input: T) => R
): R => {
  return selector(input);
};
