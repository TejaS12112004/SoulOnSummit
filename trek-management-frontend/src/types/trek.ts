import type { TrekDifficulty } from './difficulty';

export interface CreateTrekRequest {
  title: string;
  subtitle?: string;
  description: string;
  location: string;
  state?: string;
  country?: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  distanceKm?: number;
  maxAltitude?: number;
  summitPoint?: string;
  latitude?: number;
  longitude?: number;
  pickupPoint?: string;
  dropPoint?: string;
  coverImageUrl?: string;
  itineraryPdfUrl?: string;
  included?: string;
  excluded?: string;
  thingsToCarry?: string;
  cancellationPolicy?: string;
}

export interface UpdateTrekRequest extends Partial<CreateTrekRequest> {}

export interface TrekSummaryResponse {
  id: string;
  title: string;
  subtitle?: string;
  location: string;
  state?: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  coverImageUrl?: string;
  featured: boolean;
  published: boolean;
  lowestPrice?: number;
  nextDepartureDate?: string;
  nextDepartureAvailableSeats?: number;
}

export interface ItineraryDayResponse {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  stay?: string;
  meals?: string;
  distanceKm?: number;
  durationHours?: number;
  altitude?: number;
  imageUrl?: string;
  displayOrder: number;
}

export interface CreateItineraryDayRequest {
  dayNumber: number;
  title: string;
  description: string;
  stay?: string;
  meals?: string;
  distanceKm?: number;
  durationHours?: number;
  altitude?: number;
  imageUrl?: string;
  displayOrder: number;
}

export interface UpdateItineraryDayRequest extends Partial<CreateItineraryDayRequest> {}

export interface TrekResponse {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  location: string;
  state?: string;
  country?: string;
  difficulty: TrekDifficulty;
  durationDays: number;
  distanceKm?: number;
  maxAltitude?: number;
  summitPoint?: string;
  latitude?: number;
  longitude?: number;
  pickupPoint?: string;
  dropPoint?: string;
  coverImageUrl?: string;
  itineraryPdfUrl?: string;
  included?: string;
  excluded?: string;
  thingsToCarry?: string;
  cancellationPolicy?: string;
  featured: boolean;
  published: boolean;
  active: boolean;
  
  images?: any[];
  faqs?: any[];
  itineraryDays?: ItineraryDayResponse[];
  highlights?: any[];
  inclusions?: any[];
  exclusions?: any[];
  packingItems?: any[];
  departures?: any[];

  lowestPrice?: number;
  nextDepartureDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrekFilterRequest {
  title?: string;
  difficulty?: string;
  minDurationDays?: number;
  maxDurationDays?: number;
  minPrice?: number;
  maxPrice?: number;
  state?: string;
  location?: string;
  featured?: boolean;
  isActive?: boolean;
  published?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  size?: number;
}
