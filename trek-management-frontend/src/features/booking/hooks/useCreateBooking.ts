/**
 * useCreateBooking — mutation for submitting a new booking.
 *
 * On success:
 *   - Invalidates the user bookings cache so the list refreshes.
 *   - Returns a CreateBookingResult which includes razorpayOrderId
 *     for Sprint 5.2 payment initiation.
 *
 * On error:
 *   - React Query surfaces the error; the calling component is
 *     responsible for displaying feedback (via toast / form error).
 */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import bookingService from '@/services/bookingService'
import { mapCreateBookingResult } from '../mappers/bookingMapper'
import type { CreateBookingRequestDto } from '@/types/api'
import type { CreateBookingResult } from '../types/booking'

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation<CreateBookingResult, Error, CreateBookingRequestDto>({
    mutationFn: async (data: CreateBookingRequestDto) => {
      const dto = await bookingService.create(data)
      return mapCreateBookingResult(dto)
    },
    onSuccess: () => {
      // Invalidate the user's booking list so it re-fetches with the new booking
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.user() })
    },
  })
}
