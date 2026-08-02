import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import trekService from '@/services/trekService'
import type { PageResponse, UpcomingBatchResponse } from '@/types/api'

interface UseUpcomingBatchesParams {
  page: number
  size: number
}

/**
 * Fetches publicly visible upcoming TrekDepartures across all published treks.
 * Data is paginated; ordering (startDate ASC) is enforced by the backend.
 * Cache is keyed by { page, size } so navigating pages creates distinct cache entries.
 */
export function useUpcomingBatches({ page, size }: UseUpcomingBatchesParams) {
  return useQuery<PageResponse<UpcomingBatchResponse>, Error>({
    queryKey: queryKeys.departures.upcomingBatches({ page, size }),
    queryFn: () => trekService.listUpcomingBatches({ page, size }),
    staleTime: 60_000, // 1 min — seat counts can change, so don't cache too long
  })
}
