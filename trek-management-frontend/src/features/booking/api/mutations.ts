import { useMutation, useQueryClient } from '@tanstack/react-query';
import bookingService from '@/services/bookingService';
import { queryKeys } from '@/api/queryKeys';
import type { CreateBookingRequestDto, CreateBookingResponseDto } from '@/types/api';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateBookingResponseDto, Error, CreateBookingRequestDto>({
    mutationFn: (payload: CreateBookingRequestDto) => bookingService.create(payload),
    onSuccess: () => {
      // Invalidate both trek details and departures to update availableSeats
      queryClient.invalidateQueries({ queryKey: queryKeys.treks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.departures.all() });
    },
  });
};
