/**
 * Trek Detail View Models — consumed by TrekDetailPage components.
 *
 * These are NEVER backend DTOs. All mapping happens in trekDetailMapper.ts
 * called via React Query select().
 */
import type { TrekDifficulty } from '@/types/difficulty'

export type DepartureStatus = 'OPEN' | 'CANCELLED' | 'COMPLETED'

export interface TrekItineraryDayViewModel {
  id: string
  dayNumber: number
  title: string
  description: string | null
  stay: string | null
  meals: string | null
  distanceKm: number | null
  durationHours: number | null
  altitude: number | null
  imageUrl: string | null
}

export interface TrekImageViewModel {
  id: string
  imageUrl: string
  caption: string | null
  displayOrder: number
}

export interface TrekHighlightViewModel {
  id: string
  title: string
  description: string | null
  iconName: string | null
}

export interface TrekInclusionViewModel {
  id: string
  title: string
  description: string | null
}

export interface TrekExclusionViewModel {
  id: string
  title: string
  description: string | null
}

export interface TrekPackingItemViewModel {
  id: string
  title: string
  description: string | null
}

export interface TrekFaqViewModel {
  id: string
  question: string
  answer: string
}

export interface TrekDepartureViewModel {
  id: string
  startDate: string          // ISO date string "YYYY-MM-DD"
  endDate: string            // ISO date string "YYYY-MM-DD"
  registrationDeadline: string
  price: number
  discountPrice: number | null
  /** The effective display price: discountPrice ?? price */
  effectivePrice: number
  totalSeats: number
  availableSeats: number
  status: DepartureStatus
  isFillingFast: boolean
  isSoldOut: boolean
}

export interface TrekDetailViewModel {
  id: string
  title: string
  subtitle: string | null
  description: string
  location: string
  state: string
  country: string
  difficulty: TrekDifficulty
  durationDays: number
  distanceKm: number | null
  maxAltitude: number | null
  summitPoint: string | null
  pickupPoint: string | null
  dropPoint: string | null
  coverImageUrl: string | null
  itineraryPdfUrl: string | null
  /** Raw text from backend (may be newline-separated or prose) */
  included: string | null
  excluded: string | null
  thingsToCarry: string | null
  cancellationPolicy: string | null
  featured: boolean
  lowestPrice: number | null
  nextDepartureDate: string | null   // ISO date

  images: TrekImageViewModel[]
  highlights: TrekHighlightViewModel[]
  itineraryDays: TrekItineraryDayViewModel[]
  inclusions: TrekInclusionViewModel[]
  exclusions: TrekExclusionViewModel[]
  packingItems: TrekPackingItemViewModel[]
  faqs: TrekFaqViewModel[]
  departures: TrekDepartureViewModel[]
}
