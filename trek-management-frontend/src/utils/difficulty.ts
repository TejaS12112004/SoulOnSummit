import type { TrekDifficulty } from '@/types/difficulty';

export function getDifficultyColor(difficulty: TrekDifficulty): string {
  switch (difficulty) {
    case 'Easy':     return 'bg-green-100 text-green-800';
    case 'Moderate': return 'bg-yellow-100 text-yellow-800';
    case 'Hard':     return 'bg-red-100 text-red-800';
  }
}
