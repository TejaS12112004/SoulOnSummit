import type { PaginationParams } from '@/types/api'
import type { TrekDifficulty } from '@/types/difficulty'
import type { BookingStatus, PaymentStatus } from '@/features/booking/types/booking'
import type {
  TrekImageResponseDto,
  ItineraryDayResponseDto,
  HighlightResponseDto,
  InclusionResponseDto,
  ExclusionResponseDto,
  PackingItemResponseDto,
  FaqResponseDto
} from '@/types/api'

// ── Dashboard Metrics ────────────────────────────────────────────────────────

export interface DashboardMetricsResponse {
  todayBookings: number
  totalRevenue: number
  upcomingDepartures: number
  totalUsers: number
  pendingPayments: number
}

export interface ChartDataPoint {
  date: string
  value: number
}

export interface DashboardChartsResponse {
  bookingsLast30Days: ChartDataPoint[]
  revenueLast30Days: ChartDataPoint[]
  usersLast30Days: ChartDataPoint[]
}

// ── Admin Trek ───────────────────────────────────────────────────────────────

export interface AdminTrekSummary {
  id: string
  title: string
  subtitle: string
  location: string
  state: string
  difficulty: TrekDifficulty
  durationDays: number
  coverImageUrl: string
  featured: boolean
  published: boolean
  lowestPrice: number | null
  nextDepartureDate: string | null
  nextDepartureAvailableSeats: number | null
}

export interface AdminTrekDetail extends AdminTrekSummary {
  description: string
  country: string
  distanceKm: number
  maxAltitude: number
  summitPoint: string
  latitude: number
  longitude: number
  pickupPoint: string
  dropPoint: string
  itineraryPdfUrl: string
  included: string
  excluded: string
  thingsToCarry: string
  cancellationPolicy: string
  active: boolean
  images: TrekImageResponseDto[]
  faqs: FaqResponseDto[]
  itineraryDays: ItineraryDayResponseDto[]
  highlights: HighlightResponseDto[]
  inclusions: InclusionResponseDto[]
  exclusions: ExclusionResponseDto[]
  packingItems: PackingItemResponseDto[]
  departures: AdminDeparture[]
}

// ── Admin Departure ──────────────────────────────────────────────────────────

export type DepartureStatus = 'OPEN' | 'CANCELLED' | 'COMPLETED'

export interface AdminDeparture {
  id: string
  trekId: string
  startDate: string
  endDate: string
  registrationDeadline: string
  price: number
  discountPrice: number | null
  totalSeats: number
  availableSeats: number
  status: DepartureStatus
  isFillingFast: boolean
  isSoldOut: boolean
  active: boolean
}

// ── Admin Booking ────────────────────────────────────────────────────────────

export interface AdminBookingResponse {
  id: string
  bookingReference: string
  userEmail: string
  userName: string
  trekTitle: string
  startDate: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  bookingSource: string
  totalParticipants: number
  totalAmount: number
  bookedAt: string
}

// ── Request Payloads ─────────────────────────────────────────────────────────

export interface CreateDepartureRequest {
  startDate: string
  endDate: string
  registrationDeadline: string
  price: number
  discountPrice?: number | null
  totalSeats: number
  status: DepartureStatus
}

// Reuse CreateTrekRequest and UpdateTrekRequest or make them Partial<AdminTrekDetail>
export type CreateTrekRequest = Omit<AdminTrekDetail, 'id' | 'departures'>
export type UpdateTrekRequest = Partial<CreateTrekRequest>
export type UpdateBookingRequest = Partial<AdminBookingResponse>

export interface AdminFilters extends PaginationParams {
  search?: string
  status?: string | BookingStatus | DepartureStatus
  difficulty?: TrekDifficulty | TrekDifficulty[]
  featured?: boolean
  published?: boolean
}
