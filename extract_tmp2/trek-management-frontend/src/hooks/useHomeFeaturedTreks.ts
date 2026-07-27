import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import homeService from '@/services/homeService'
import { mapFeaturedTrek } from '@/mappers/homeMapper'
import type { HomeFeaturedTrekViewModel } from '@/types/home'
import type { HomeFeaturedTrekResponse } from '@/types/api'

export function useHomeFeaturedTreks() {
  return useQuery<HomeFeaturedTrekResponse[], Error, HomeFeaturedTrekViewModel[]>({
    queryKey: queryKeys.home.featuredTreks(),
    queryFn: async () => {
      const response = await homeService.getFeaturedTreks()
      return response
    },
    select: (data) => data.map(mapFeaturedTrek),
  })
}
