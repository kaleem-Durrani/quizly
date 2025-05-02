import { QueryClient } from '@tanstack/react-query';

/**
 * Configure React Query client with default options
 * 
 * This sets up the default behavior for all queries and mutations in the application.
 * You can override these options for individual queries and mutations.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch when window regains focus (default: true)
      retry: 1, // Retry failed requests once (default: 3)
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes (default: 5 * 60 * 1000)
      gcTime: 10 * 60 * 1000, // Garbage collection time for stale data (default: 5 * 60 * 1000)
    },
    mutations: {
      retry: 1, // Retry failed mutations once (default: 3)
    },
  },
});

export default queryClient;
