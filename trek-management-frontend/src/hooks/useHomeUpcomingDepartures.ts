import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import homeService from '@/services/homeService'
import { mapUpcomingDeparture } from '@/mappers/homeMapper'
import type { HomeUpcomingDepartureViewModel } from '@/types/home'
import type { HomeUpcomingDepartureResponse } from '@/types/api'

export function useHomeUpcomingDepartures() {
  return useQuery<HomeUpcomingDepartureResponse[], Error, HomeUpcomingDepartureViewModel[]>({
    queryKey: queryKeys.home.upcomingDepartures(),
    queryFn: async () => {
      const response = await homeService.getUpcomingDepartures()
      return response
    },
    select: (data) => data.map(mapUpcomingDeparture),
    staleTime: 60 * 1000, // 60 seconds as per requirements
  })
}
