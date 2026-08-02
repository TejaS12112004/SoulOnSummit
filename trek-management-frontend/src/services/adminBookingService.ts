import apiClient from '@/api/apiClient';
import type { ApiResponse, PageResponse } from '@/types/api';
import type { AdminBookingResponse, BookingResponseDto, UpdateBookingAdminRequest, BookingStatus, PaymentStatus } from '@/types/api';

export interface AdminBookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  departureId?: string;
  bookingReference?: string;
  email?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

const adminBookingService = {
  /**
   * Fetch all bookings with filtering and pagination
   */
  listBookings: (filters: AdminBookingFilters): Promise<PageResponse<AdminBookingResponse>> => {
    return apiClient
      .get<ApiResponse<PageResponse<AdminBookingResponse>>>('/admin/bookings', { params: filters })
      .then((res) => res.data.data);
  },

  /**
   * Get complete details of a specific booking
   */
  getBookingDetails: (id: string): Promise<BookingResponseDto> => {
    return apiClient
      .get<ApiResponse<BookingResponseDto>>(`/admin/bookings/${id}`)
      .then((res) => res.data.data);
  },

  /**
   * Update the status or details of a booking
   */
  updateBooking: (id: string, payload: UpdateBookingAdminRequest): Promise<AdminBookingResponse> => {
    return apiClient
      .patch<ApiResponse<AdminBookingResponse>>(`/admin/bookings/${id}`, payload)
      .then((res) => res.data.data);
  },

  /**
   * Cancel a booking (Admin override)
   */
  cancelBooking: (id: string): Promise<void> => {
    return apiClient
      .post<ApiResponse<void>>(`/admin/bookings/${id}/cancel`)
      .then((res) => res.data.data);
  }
};

export default adminBookingService;
