// Barrel export for the booking feature
// Import from this file, not from individual submodules
export type {
  BookingStatus,
  PaymentStatus,
  Gender,
  ParticipantViewModel,
  BookingDetailViewModel,
  BookingSummaryViewModel,
  CreateBookingResult,
} from './types/booking'

export type { BookingFormValues, TravellerFormValues } from './schemas/bookingSchema'
export { createBookingSchema, TravellerSchema } from './schemas/bookingSchema'

export { mapBookingDetail, mapBookingSummary, mapCreateBookingResult, mapParticipant } from './mappers/bookingMapper'

export { useUserBookings } from './hooks/useUserBookings'
export { useBooking } from './hooks/useBooking'
export { useCreateBooking } from './hooks/useCreateBooking'
export { useCancelBooking } from './hooks/useCancelBooking'
export { useBookingDraft } from './hooks/useBookingDraft'
export { BookingPageSkeleton } from './components/BookingPageSkeleton'
