/**
 * useTrekDepartures — fetches upcoming open departures for a trek.
 *
 * Note: TrekResponse already includes departures. This hook exists for
 * independent departure refreshing (e.g., polling seat availability).
 * In the current sprint, TrekDetailPage uses departures from useTrekDetail.
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import trekService from '@/services/trekService'
import { mapDeparture } from '../mappers/trekDetailMapper'

export function useTrekDepartures(trekId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.departures.byTrek(trekId ?? ''),
    queryFn: () => trekService.getDepartures(trekId!),
    enabled: !!trekId,
    select: (data) => data.map(mapDeparture),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
