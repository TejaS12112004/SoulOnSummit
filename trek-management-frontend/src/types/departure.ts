import type { TrekDifficulty } from './difficulty';

export interface Departure {
  id: string;
  trek: string;
  trekSlug: string;
  date: string;
  difficulty: TrekDifficulty;
  seatsLeft: number;
  price: number;
}
