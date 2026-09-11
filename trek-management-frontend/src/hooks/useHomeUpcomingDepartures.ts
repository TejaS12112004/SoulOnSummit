import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import homeService from '@/services/homeService'
import type { UpcomingBatchResponse } from '@/types/api'

export function useHomeUpcomingDepartures() {
  return useQuery<UpcomingBatchResponse[], Error>({
    queryKey: queryKeys.home.upcomingDepartures(),
    queryFn: async () => {
      const response = await homeService.getUpcomingDepartures()
      return response
    },
    staleTime: 60 * 1000, // 60 seconds as per requirements
  })
}
