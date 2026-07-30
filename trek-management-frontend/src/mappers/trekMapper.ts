import type { TrekSummaryResponse } from '@/types/api'
import type { Trek } from '@/components/ui/TrekCard'

export const mapTrekSummary = (dto: TrekSummaryResponse): Trek => {
  return {
    id: dto.id,
    title: dto.title,
    coverImage: dto.coverImageUrl,
    difficulty: dto.difficulty,
    durationDays: dto.durationDays,
    maxAltitude: dto.maxAltitude ?? undefined,
    location: dto.location,
    state: dto.state,
    startingPrice: dto.lowestPrice ?? 0,
    originalPrice: dto.originalPrice ?? undefined,
    departureDate: dto.nextDepartureDate ?? undefined,
    seatsRemaining: dto.nextDepartureAvailableSeats ?? undefined,
    isFeatured: dto.featured,
    rating: dto.rating ?? undefined,
    reviewCount: dto.reviewCount ?? undefined,
  }
}
