/**
 * useUserBookings — fetches the authenticated user's booking list.
 *
 * Requires the user to be authenticated (apiClient attaches Authorization header).
 * Mapping from DTO → ViewModel happens inside select(), keeping queryFn pure.
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import bookingService from '@/services/bookingService'
import { mapBookingSummary } from '../mappers/bookingMapper'

export function useUserBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.user(),
    queryFn: bookingService.getMyBookings,
    select: (data) => data.map(mapBookingSummary),
    staleTime: 1000 * 60 * 2, // 2 minutes — bookings change more frequently than trek listings
  })
}
