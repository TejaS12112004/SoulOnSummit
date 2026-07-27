/**
 * Booking service — all API calls for the booking domain.
 *
 * Endpoints consumed:
 *   POST /api/v1/bookings              → ENDPOINTS.BOOKINGS.CREATE
 *   GET  /api/v1/bookings              → ENDPOINTS.BOOKINGS.MY_BOOKINGS
 *   GET  /api/v1/bookings/:id          → ENDPOINTS.BOOKINGS.BY_ID(id)
 *   POST /api/v1/bookings/:id/cancel   → ENDPOINTS.BOOKINGS.CANCEL(id)
 *
 * Rules:
 * - Returns raw DTOs only. No mapping here.
 * - Mapping is performed in hooks via React Query select().
 * - Uses ENDPOINTS registry — no hardcoded strings.
 */
import apiClient from '@/api/apiClient'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiResponse,
  BookingResponseDto,
  BookingSummaryResponseDto,
  CreateBookingRequestDto,
  CreateBookingResponseDto,
} from '@/types/api'

const bookingService = {
  /**
   * Create a new booking.
   * Returns a CreateBookingResponseDto which includes razorpayOrderId
   * for future payment integration (Sprint 5.2).
   */
  create: (data: CreateBookingRequestDto): Promise<CreateBookingResponseDto> =>
    apiClient
      .post<ApiResponse<CreateBookingResponseDto>>(ENDPOINTS.BOOKINGS.CREATE, data)
      .then((r) => r.data.data),

  /**
   * Fetch the authenticated user's booking list.
   * Backend: GET /api/v1/bookings (secured, returns current user's bookings).
   */
  getMyBookings: (): Promise<BookingSummaryResponseDto[]> =>
    apiClient
      .get<ApiResponse<BookingSummaryResponseDto[]>>(ENDPOINTS.BOOKINGS.MY_BOOKINGS)
      .then((r) => r.data.data),

  /**
   * Fetch a single booking by ID (must belong to the current user).
   */
  getById: (id: string): Promise<BookingResponseDto> =>
    apiClient
      .get<ApiResponse<BookingResponseDto>>(ENDPOINTS.BOOKINGS.BY_ID(id))
      .then((r) => r.data.data),

  /**
   * Cancel a booking by ID.
   */
  cancel: (id: string): Promise<void> =>
    apiClient
      .post<ApiResponse<null>>(ENDPOINTS.BOOKINGS.CANCEL(id))
      .then(() => undefined),
}

export default bookingService
