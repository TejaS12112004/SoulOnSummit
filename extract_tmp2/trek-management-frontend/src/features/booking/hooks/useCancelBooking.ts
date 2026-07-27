/**
 * useCancelBooking — mutation for cancelling an existing booking.
 *
 * On success:
 *   - Invalidates the specific booking detail cache.
 *   - Invalidates the user bookings list cache.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import bookingService from '@/services/bookingService'

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => bookingService.cancel(id),
    onSuccess: (_data, id) => {
      // Invalidate both the detail and list caches
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byId(id) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user() })
    },
  })
}
