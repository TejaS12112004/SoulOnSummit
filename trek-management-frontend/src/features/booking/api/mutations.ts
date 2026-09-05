import { useMutation, useQueryClient } from '@tanstack/react-query';
import bookingService from '@/services/bookingService';
import { queryKeys } from '@/api/queryKeys';
import type { CreateBookingRequestDto, CreateBookingResponseDto } from '@/types/api';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateBookingResponseDto, Error, CreateBookingRequestDto>({
    mutationFn: (data: CreateBookingRequestDto) => bookingService.create(data),
    onSuccess: (data, variables) => {
      // Invalidate both trek details and departures to update availableSeats
      queryClient.invalidateQueries({ queryKey: queryKeys.treks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.departures.all });
    },
  });
};
