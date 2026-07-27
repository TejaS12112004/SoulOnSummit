import type { TrekDifficulty } from '@/types/difficulty';

export function getDifficultyColor(difficulty: TrekDifficulty): string {
  switch (difficulty) {
    case 'EASY':      return 'bg-green-100 text-green-800';
    case 'MODERATE':  return 'bg-yellow-100 text-yellow-800';
    case 'DIFFICULT': return 'bg-red-100 text-red-800';
    case 'EXTREME':   return 'bg-purple-100 text-purple-800';
    default:          return 'bg-gray-100 text-gray-800';
  }
}
