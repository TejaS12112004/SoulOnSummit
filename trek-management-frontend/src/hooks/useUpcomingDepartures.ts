/**
 * useUpcomingDepartures — React Query hook skeleton.
 *
 * Consumes: GET /api/v1/treks/upcoming-departures via departureService.getUpcoming()
 *
 * To implement:
 *   1. Remove the placeholder throw.
 *   2. Replace with: return useQuery({ queryKey, queryFn })
 *   3. The DepartureCard component requires no structural changes.
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type { HomeUpcomingDepartureViewModel } from '@/types/home'

export function useUpcomingDepartures() {
  return useQuery<HomeUpcomingDepartureViewModel[]>({
    queryKey: queryKeys.departures.upcoming(),
    // TODO: implement — replace with departureService.getUpcoming()
    queryFn: () => {
      throw new Error('useUpcomingDepartures: not yet implemented')
    },
    enabled: false, // remove when implemented
  })
}
