/**
 * Booking mapper ?" transforms backend DTOs into frontend View Models.
 *
 * Rules:
 * - No component should consume a DTO directly.
 * - All mapping happens inside React Query's select() option.
 * - BigDecimal comes over the wire as a number from Spring Boot's Jackson serializer.
 */
import type {
  BookingResponseDto,
  BookingSummaryResponseDto,
  CreateBookingResponseDto,
  ParticipantResponseDto,
} from '@/types/api'
import type {
  BookingDetailViewModel,
  BookingSummaryViewModel,
  CreateBookingResult,
  ParticipantViewModel,
  Gender,
  BookingStatus,
  PaymentStatus,
} from '../types/booking'

export function mapParticipant(dto: ParticipantResponseDto): ParticipantViewModel {
  return {
    id: dto.id || '',
    fullName: dto.fullName,
    age: dto.age,
    gender: dto.gender as Gender,
    phone: dto.phone || null,
    email: dto.email || null,
    emergencyContactName: dto.emergencyContactName || "",
    emergencyContactPhone: dto.emergencyContactPhone || "",
    medicalConditions: dto.medicalConditions || null,
    previousTrekExperience: dto.previousTrekExperience || null,
  }
}

export function mapBookingDetail(dto: BookingResponseDto): BookingDetailViewModel {
  return {
    id: dto.id || '',
    bookingReference: dto.bookingReference,
    departureId: dto.departureId,
    trekTitle: dto.trekTitle,
    startDate: dto.startDate,
    endDate: dto.endDate,
    difficulty: dto.difficulty,
    durationDays: dto.durationDays,
    location: dto.location,
    status: dto.status as BookingStatus,
    paymentStatus: dto.paymentStatus as PaymentStatus,
    totalParticipants: dto.totalParticipants || 1, // Fallback
    subtotal: dto.subtotal,
    discountAmount: dto.discountAmount,
    totalAmount: dto.totalAmount,
    specialRequests: dto.specialRequests,
    bookedAt: dto.bookedAt,
    paymentDueAt: dto.paymentDueAt,
    participants: dto.participants.map(mapParticipant),
  }
}

export function mapBookingSummary(dto: BookingSummaryResponseDto): BookingSummaryViewModel {
  return {
    id: dto.id || '',
    bookingReference: dto.bookingReference,
    trekTitle: dto.trekTitle,
    startDate: dto.startDate,
    status: dto.status as BookingStatus,
    paymentStatus: dto.paymentStatus as PaymentStatus,
    totalParticipants: 1, // Fallback (Missing from DTO)
    totalAmount: dto.totalAmount,
    bookedAt: dto.bookedAt,
  }
}

export function mapCreateBookingResult(dto: CreateBookingResponseDto): CreateBookingResult {
  return {
    bookingId: dto.bookingId,
    bookingReference: dto.bookingReference,
    razorpayOrderId: dto.razorpayOrderId,
    amount: 0, // Fallback
    currency: "INR", // Fallback
  }
}
