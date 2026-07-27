import type { HomeFeaturedTrekResponse, HomeUpcomingDepartureResponse } from '@/types/api'
import type { HomeFeaturedTrekViewModel, HomeUpcomingDepartureViewModel } from '@/types/home'
import type { TrekDifficulty } from '@/types/difficulty'

export function mapFeaturedTrek(dto: HomeFeaturedTrekResponse): HomeFeaturedTrekViewModel {
  return {
    id: dto.id,
    title: dto.title,
    subtitle: dto.subtitle,
    location: dto.location,
    state: dto.state,
    difficulty: dto.difficulty as TrekDifficulty,
    durationDays: dto.durationDays,
    coverImageUrl: dto.coverImageUrl,
    maxAltitude: dto.maxAltitude,
    price: dto.price ?? 0,
    originalPrice: dto.originalPrice ?? 0,
    nextBatch: dto.nextBatch ?? '',
    seatsLeft: dto.seatsLeft ?? 0,
    rating: dto.rating ?? 0,
    reviewCount: dto.reviewCount ?? 0,
    featured: dto.featured,
  }
}

export function mapUpcomingDeparture(dto: HomeUpcomingDepartureResponse): HomeUpcomingDepartureViewModel {
  return {
    departureId: dto.departureId,
    trekTitle: dto.title,
    trekId: dto.trekId,
    departureDate: dto.departureDate,
    difficulty: dto.difficulty as TrekDifficulty,
    availableSeats: dto.availableSeats ?? 0,
    price: dto.price ?? 0,
  }
}
