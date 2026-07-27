/**
 * Booking domain types — View Models consumed by components.
 *
 * These types are NEVER directly mapped from backend DTOs.
 * Mapping happens in bookingMapper.ts via React Query select.
 */

// ── Enums ──────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'COMPLETED'
  | 'REFUNDED'

export type PaymentStatus =
  | 'CREATED'
  | 'ATTEMPTED'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'

// ── View Models ────────────────────────────────────────────────────────────

export interface ParticipantViewModel {
  id: string
  fullName: string
  age: number
  gender: Gender
  phone: string | null
  email: string | null
  emergencyContactName: string
  emergencyContactPhone: string
  medicalConditions: string | null
  previousTrekExperience: string | null
}

/** Full booking detail — used on booking detail page */
export interface BookingDetailViewModel {
  id: string
  bookingReference: string
  departureId: string
  /** TD-002: Temporary field to avoid a dedicated review endpoint */
  trekTitle: string
  /** TD-002: Temporary field to avoid a dedicated review endpoint */
  startDate: string
  /** TD-002: Temporary field to avoid a dedicated review endpoint */
  endDate: string
  /** TD-002: Temporary field to avoid a dedicated review endpoint */
  difficulty: import('@/types/difficulty').TrekDifficulty
  /** TD-002: Temporary field to avoid a dedicated review endpoint */
  durationDays: number
  /** TD-002: Temporary field to avoid a dedicated review endpoint */
  location: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalParticipants: number
  subtotal: number
  discountAmount: number
  totalAmount: number
  specialRequests: string | null
  bookedAt: string         // ISO string for display
  paymentDueAt: string     // ISO string for display
  participants: ParticipantViewModel[]
}

/** Booking summary — used on My Bookings list */
export interface BookingSummaryViewModel {
  id: string
  bookingReference: string
  trekTitle: string
  startDate: string        // ISO date string e.g. "2025-03-15"
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalParticipants: number
  totalAmount: number
  bookedAt: string         // ISO string for display
}

/** Response from the create-booking API — passed to payment layer in Sprint 5.2 */
export interface CreateBookingResult {
  bookingId: string
  bookingReference: string
  /** Razorpay order ID — used in Sprint 5.2 for payment initiation */
  razorpayOrderId: string
  amount: number
  currency: string
}
