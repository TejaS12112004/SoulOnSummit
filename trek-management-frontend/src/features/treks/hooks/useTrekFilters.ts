import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import type { TrekFilterParams, SortDir } from '@/types/api'
import type { TrekDifficulty } from '@/types/difficulty'

export function useTrekFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo((): TrekFilterParams => {
    return {
      search: searchParams.get('search') || undefined,
      difficulty: searchParams.getAll('difficulty') as TrekDifficulty[],
      minDurationDays: searchParams.get('minDurationDays') ? Number(searchParams.get('minDurationDays')) : undefined,
      maxDurationDays: searchParams.get('maxDurationDays') ? Number(searchParams.get('maxDurationDays')) : undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      state: searchParams.get('state') || undefined,
      location: searchParams.get('location') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 0,
      size: searchParams.get('size') ? Number(searchParams.get('size')) : 20,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortDir: (searchParams.get('sortDir') as SortDir) || 'desc',
    }
  }, [searchParams])

  const updateFilter = useCallback(
    (newFilters: Partial<TrekFilterParams>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            next.delete(key)
          } else if (Array.isArray(value)) {
            next.delete(key)
            value.forEach(v => next.append(key, String(v)))
          } else {
            next.set(key, String(value))
          }
        })
        
        // Reset to page 0 if filters change (except when explicitly changing page)
        if (!('page' in newFilters) && prev.get('page')) {
          next.delete('page')
        }

        return next
      })
    },
    [setSearchParams]
  )

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    filters,
    updateFilter,
    clearFilters,
  }
}
