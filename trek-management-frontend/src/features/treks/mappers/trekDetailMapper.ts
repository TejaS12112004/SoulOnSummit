/**
 * Trek Detail Mapper — transforms backend TrekResponseDto into TrekDetailViewModel.
 *
 * Called exclusively via React Query select() in useTrekDetail.ts.
 * Components NEVER receive raw DTOs.
 */
import type {
  TrekResponseDto,
  DepartureResponseDto,
  ItineraryDayResponseDto,
  TrekImageResponseDto,
  HighlightResponseDto,
  InclusionResponseDto,
  ExclusionResponseDto,
  PackingItemResponseDto,
  FaqResponseDto,
} from '@/types/api'
import type {
  TrekDetailViewModel,
  TrekDepartureViewModel,
  TrekItineraryDayViewModel,
  TrekImageViewModel,
  TrekHighlightViewModel,
  TrekInclusionViewModel,
  TrekExclusionViewModel,
  TrekPackingItemViewModel,
  TrekFaqViewModel,
} from '../types/trekDetail'

function mapImage(dto: TrekImageResponseDto): TrekImageViewModel {
  return {
    id: dto.id,
    imageUrl: "", // Fallback
    caption: "", // Fallback
    displayOrder: dto.displayOrder,
  }
}

function mapItineraryDay(dto: ItineraryDayResponseDto): TrekItineraryDayViewModel {
  return {
    id: dto.id,
    dayNumber: dto.dayNumber,
    title: dto.title,
    description: dto.description,
    stay: dto.accommodation, // Fallback mapped from accommodation
    meals: dto.meals,
    distanceKm: 0, // Fallback
    durationHours: 0, // Fallback
    altitude: Number.parseInt(dto.altitudeInfo || "0", 10),
    imageUrl: '',
  }
}

function mapHighlight(dto: HighlightResponseDto): TrekHighlightViewModel {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    iconName: "Mountain", // Fallback
  }
}

function mapInclusion(dto: InclusionResponseDto): TrekInclusionViewModel {
  return { id: dto.id, title: dto.title, description: dto.description }
}

function mapExclusion(dto: ExclusionResponseDto): TrekExclusionViewModel {
  return { id: dto.id, title: dto.title, description: dto.description }
}

function mapPackingItem(dto: PackingItemResponseDto): TrekPackingItemViewModel {
  return { id: dto.id, title: dto.title, description: dto.description }
}

function mapFaq(dto: FaqResponseDto): TrekFaqViewModel {
  return { id: dto.id, question: dto.question, answer: dto.answer }
}

export function mapDeparture(dto: DepartureResponseDto): TrekDepartureViewModel {
  return {
    id: dto.id,
    startDate: dto.startDate,
    endDate: dto.endDate,
    registrationDeadline: dto.registrationDeadline,
    price: dto.price,
    discountPrice: dto.discountPrice,
    effectivePrice: dto.discountPrice ?? dto.price,
    totalSeats: dto.totalSeats,
    availableSeats: dto.availableSeats,
    status: dto.status as "OPEN" | "CANCELLED" | "COMPLETED",
    isFillingFast: dto.isFillingFast,
    isSoldOut: dto.isSoldOut,
  }
}

export function mapTrekDetail(dto: TrekResponseDto): TrekDetailViewModel {
  return {
    id: dto.id,
    title: dto.title,
    subtitle: dto.subtitle,
    description: dto.description,
    location: dto.location,
    state: dto.state,
    country: dto.country,
    difficulty: dto.difficulty,
    durationDays: dto.durationDays,
    distanceKm: dto.distanceKm,
    maxAltitude: dto.maxAltitude,
    summitPoint: dto.summitPoint,
    pickupPoint: dto.pickupPoint,
    dropPoint: dto.dropPoint,
    coverImageUrl: dto.coverImageUrl,
    itineraryPdfUrl: dto.itineraryPdfUrl,
    included: dto.included,
    excluded: dto.excluded,
    thingsToCarry: dto.thingsToCarry,
    cancellationPolicy: dto.cancellationPolicy,
    featured: dto.featured,
    lowestPrice: dto.lowestPrice,
    nextDepartureDate: dto.nextDepartureDate,
    images: (dto.images ?? []).map(mapImage),
    highlights: (dto.highlights ?? []).map(mapHighlight),
    itineraryDays: (dto.itineraryDays ?? []).map(mapItineraryDay),
    inclusions: (dto.inclusions ?? []).map(mapInclusion),
    exclusions: (dto.exclusions ?? []).map(mapExclusion),
    packingItems: (dto.packingItems ?? []).map(mapPackingItem),
    faqs: (dto.faqs ?? []).map(mapFaq),
    departures: (dto.departures ?? []).map(mapDeparture),
  }
}
