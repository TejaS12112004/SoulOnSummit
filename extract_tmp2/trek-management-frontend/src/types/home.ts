import type { TrekDifficulty } from './difficulty';

export interface HomeFeaturedTrekViewModel {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  state: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  coverImageUrl: string;
  maxAltitude: number;
  price: number;
  originalPrice: number;
  nextBatch: string;
  seatsLeft: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
}

export interface HomeUpcomingDepartureViewModel {
  departureId: string;
  trekTitle: string;
  trekId: string;
  departureDate: string;
  difficulty: TrekDifficulty;
  availableSeats: number;
  price: number;
}
