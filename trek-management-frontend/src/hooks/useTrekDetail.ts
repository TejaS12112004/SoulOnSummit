import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import trekService from '@/services/trekService'
import type { TrekResponseDto } from '@/types/api'

export function useTrekDetail(id: string) {
  return useQuery<TrekResponseDto, Error, TrekResponseDto>({
    queryKey: queryKeys.treks.byId(id),
    queryFn: () => trekService.getById(id),
    enabled: !!id,
  })
}
