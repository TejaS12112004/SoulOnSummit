import type { TrekDifficulty } from './difficulty'

// Standard backend API envelope
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Paginated response wrapper
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// Standard API error shape
export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string>
  status?: number
}

// Sort direction
export type SortDir = 'asc' | 'desc'

// Pagination params
export interface PaginationParams {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: SortDir
}

export interface TrekFilterParams extends PaginationParams {
  search?: string
  title?: string
  difficulty?: TrekDifficulty | TrekDifficulty[]
  minDurationDays?: number
  maxDurationDays?: number
  minPrice?: number
  maxPrice?: number
  state?: string
  location?: string
  featured?: boolean
  startDateFrom?: string
  startDateTo?: string
}

// ----------------------------------------------------------------------------
// HOME DTOs
// ----------------------------------------------------------------------------
export interface HomeFeaturedTrekResponse {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  state: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  coverImageUrl: string;
  maxAltitude: number;
  price: number | null;
  originalPrice: number | null;
  nextBatch: string | null;
  seatsLeft: number | null;
  rating: number | null;
  reviewCount: number | null;
  featured: boolean;
}

export interface HomeUpcomingDepartureResponse {
  departureId: string;
  trekId: string;
  title: string;
  subtitle: string;
  location: string;
  state: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  coverImageUrl: string;
  maxAltitude: number;
  departureDate: string;
  endDate: string;
  price: number | null;
  originalPrice: number | null;
  availableSeats: number | null;
  totalSeats: number | null;
  status: string;
  featured: boolean;
}

// ----------------------------------------------------------------------------
// TREK DTOs
// ----------------------------------------------------------------------------
export interface TrekSummaryResponse {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  state: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  coverImageUrl: string;
  featured: boolean;
  published: boolean;
  lowestPrice: number | null;
  nextDepartureDate: string | null;
  nextDepartureAvailableSeats: number | null;
}

export interface TrekImageResponseDto {
  id: string;
  imageUrl: string;
  isCover: boolean;
  displayOrder: number;
}

export interface ItineraryDayResponseDto {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  accommodation: string;
  meals: string;
  altitudeInfo: string;
}

export interface HighlightResponseDto {
  id: string;
  title: string;
  description: string;
}

export interface InclusionResponseDto {
  id: string;
  title: string;
  description: string;
  isInclusion: boolean;
}

export interface ExclusionResponseDto {
  id: string;
  title: string;
  description: string;
}

export interface PackingItemResponseDto {
  id: string;
  category: string;
  title: string;
  description: string;
  isMandatory: boolean;
}

export interface FaqResponseDto {
  id: string;
  question: string;
  answer: string;
}

export interface DepartureResponseDto {
  id: string;
  trekId: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  price: number;
  discountPrice: number | null;
  totalSeats: number;
  availableSeats: number;
  status: string;
  isFillingFast: boolean;
  isSoldOut: boolean;
  active: boolean;
}

export interface TrekResponseDto {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  location: string;
  state: string;
  country: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  distanceKm: number;
  maxAltitude: number;
  summitPoint: string;
  latitude: number;
  longitude: number;
  pickupPoint: string;
  dropPoint: string;
  coverImageUrl: string;
  itineraryPdfUrl: string;
  included: string;
  excluded: string;
  thingsToCarry: string;
  cancellationPolicy: string;
  featured: boolean;
  published: boolean;
  active: boolean;
  images: TrekImageResponseDto[];
  faqs: FaqResponseDto[];
  itineraryDays: ItineraryDayResponseDto[];
  highlights: HighlightResponseDto[];
  inclusions: InclusionResponseDto[];
  exclusions: ExclusionResponseDto[];
  packingItems: PackingItemResponseDto[];
  departures: DepartureResponseDto[];
  lowestPrice: number | null;
  nextDepartureDate: string | null;
}

// ----------------------------------------------------------------------------
// BOOKING DTOs
// ----------------------------------------------------------------------------
export interface ParticipantResponseDto {
  id?: string;
  fullName: string;
  age: number;
  gender: string;
  phone?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalConditions?: string;
  previousTrekExperience?: string;
}

export interface BookingResponseDto {
  id: string;
  bookingReference: string;
  departureId: string;
  trekTitle: string;
  startDate: string;
  endDate: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  location: string;
  status: string;
  paymentStatus: string;
  bookingSource: string;
  totalParticipants: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  specialRequests: string;
  bookedAt: string;
  paymentDueAt: string;
  participants: ParticipantResponseDto[];
}

export interface BookingSummaryResponseDto {
  id: string;
  bookingReference: string;
  departureId: string;
  trekTitle: string;
  startDate: string;
  endDate: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  bookedAt: string;
}

export interface CreateBookingRequestDto {
  departureId: string;
  participants: ParticipantResponseDto[];
  specialRequests?: string;
}

export interface CreateBookingResponseDto {
  bookingId: string;
  bookingReference: string;
  razorpayOrderId: string;
}
