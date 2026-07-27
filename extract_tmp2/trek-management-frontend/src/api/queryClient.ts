import { QueryClient, MutationCache } from '@tanstack/react-query'
import { toast } from 'sonner'
import { QUERY_DEFAULTS } from '@/constants/query'
import type { ApiError } from '@/types/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 2 min staleTime: trek schedules, prices and seat counts change infrequently.
      // Avoids hammering the API on every navigation while keeping data fresh enough.
      staleTime: QUERY_DEFAULTS.STALE_TIME,
      // 10 min gcTime: keeps cached data in memory after a component unmounts,
      // so navigating back to a page feels instant without a loading state.
      gcTime: QUERY_DEFAULTS.GC_TIME,
      retry: (failureCount, error) => {
        const apiError = error as unknown as ApiError
        // Never retry 4xx errors — they are deterministic client-side failures
        // (e.g. 401 Unauthorised, 403 Forbidden, 404 Not Found). Retrying would
        // waste bandwidth and delay surfacing the error to the user.
        if (apiError.status && apiError.status >= 400 && apiError.status < 500) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutations are not retried because they are not idempotent by default.
      // Retrying a POST (e.g. create booking) could result in duplicate records.
      // Each mutation should handle its own error state and let the user retry explicitly.
      retry: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      const apiError = error as unknown as ApiError;
      toast.error(apiError.message || 'An unexpected error occurred. Please try again.');
    },
  }),
})
