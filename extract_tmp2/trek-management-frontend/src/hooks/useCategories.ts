/**
 * useCategories — React Query hook skeleton.
 *
 * Consumes: GET /api/v1/categories via categoryService.getAll()
 *
 * To implement:
 *   1. Remove the placeholder throw.
 *   2. Replace with: return useQuery({ queryKey, queryFn })
 *   3. The CategoryCard component requires no structural changes.
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import type { Category } from '@/types/category'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories.all(),
    // TODO: implement — replace with categoryService.getAll()
    queryFn: () => {
      throw new Error('useCategories: not yet implemented')
    },
    enabled: false, // remove when implemented
  })
}
