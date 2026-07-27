/**
 * useBooking — fetches a single booking by ID.
 *
 * Only fetches when `id` is provided.
 * Mapping from DTO → ViewModel happens inside select().
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import bookingService from '@/services/bookingService'
import { mapBookingDetail } from '../mappers/bookingMapper'

export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.bookings.byId(id ?? ''),
    queryFn: () => bookingService.getById(id!),
    enabled: !!id,
    select: mapBookingDetail,
    staleTime: 1000 * 60 * 2,
  })
}
