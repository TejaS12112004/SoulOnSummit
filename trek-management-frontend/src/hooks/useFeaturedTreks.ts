/**
 * useFeaturedTreks — React Query hook skeleton.
 *
 * Consumes: GET /api/v1/treks/featured via trekService.getFeatured()
 *
 * To implement:
 *   1. Remove the placeholder throw.
 *   2. Replace with: return useQuery({ queryKey, queryFn })
 *   3. The component consuming this hook requires no structural changes.
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type { HomeFeaturedTrekViewModel } from '@/types/home'

export function useFeaturedTreks() {
  return useQuery<HomeFeaturedTrekViewModel[]>({
    queryKey: queryKeys.treks.featured,
    // TODO: implement — replace with trekService.getFeatured()
    queryFn: () => {
      throw new Error('useFeaturedTreks: not yet implemented')
    },
    enabled: false, // remove when implemented
  })
}
