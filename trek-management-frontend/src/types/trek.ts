import type { TrekDifficulty } from './difficulty';

export interface Trek {
  id: string;
  name: string;
  image: string;
  difficulty: TrekDifficulty;
  maxAltitude: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  nextBatch: string;
  seatsLeft: number;
  originalPrice: number;
  price: number;
}
