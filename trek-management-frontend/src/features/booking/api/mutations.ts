import { useMutation } from '@tanstack/react-query';
import bookingService from '@/services/bookingService';
import type { CreateBookingRequestDto, CreateBookingResponseDto } from '@/types/api';

export const useCreateBooking = () => {
  return useMutation<CreateBookingResponseDto, Error, CreateBookingRequestDto>({
    mutationFn: (data: CreateBookingRequestDto) => bookingService.create(data),
  });
};
