import { QueryClient } from '@tanstack/react-query';

/**
 * Configure React Query client
 * 
 * This sets up the default behavior for all queries in the application
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Retry failed requests once
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache data for 10 minutes
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

export default queryClient;
