/**
 * useTrekDetail — fetches full trek details by ID.
 *
 * Mapping from TrekResponseDto → TrekDetailViewModel happens in select().
 * The hook is disabled when id is undefined.
 */
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import trekService from '@/services/trekService'
import { mapTrekDetail } from '../mappers/trekDetailMapper'

export function useTrekDetail(
  id: string | undefined,
  options?: { refetchOnMount?: boolean | 'always' }
) {
  return useQuery({
    queryKey: queryKeys.treks.byId(id ?? ''),
    queryFn: () => trekService.getById(id!),
    enabled: !!id,
    select: mapTrekDetail,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: options?.refetchOnMount,
  })
}
