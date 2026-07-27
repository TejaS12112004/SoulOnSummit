import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import trekService from '@/services/trekService'
import { mapTrekSummary } from '@/mappers/trekMapper'
import type { TrekFilterParams } from '@/types/api'

export function useTreks(params: TrekFilterParams) {
  return useQuery({
    queryKey: queryKeys.treks.list(params),
    queryFn: () => trekService.listPublic(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => ({
      ...data,
      content: data.content.map(mapTrekSummary),
    }),
  })
}
