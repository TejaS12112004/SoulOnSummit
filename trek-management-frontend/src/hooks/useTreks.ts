import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import trekService from '@/services/trekService'
import type { TrekFilterParams, PageResponse, TrekSummaryResponse } from '@/types/api'

export function useTreks(filters: TrekFilterParams) {
  return useQuery<PageResponse<TrekSummaryResponse>, Error>({
    queryKey: queryKeys.treks.list(filters),
    queryFn: () => trekService.listPublic(filters),
    // Keep previous data when fetching a new page to avoid flashing loaders
    placeholderData: (previousData) => previousData,
  })
}
