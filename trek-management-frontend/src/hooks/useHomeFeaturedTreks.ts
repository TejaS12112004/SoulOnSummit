import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import homeService from '@/services/homeService'
import type { TrekSummaryResponse } from '@/types/api'

export function useHomeFeaturedTreks() {
  return useQuery<TrekSummaryResponse[], Error, TrekSummaryResponse[]>({
    queryKey: queryKeys.home.featuredTreks(),
    queryFn: async () => {
      const response = await homeService.getFeaturedTreks()
      return response
    },
  })
}
