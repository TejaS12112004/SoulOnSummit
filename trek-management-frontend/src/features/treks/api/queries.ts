import { useQuery } from '@tanstack/react-query';
import trekService from '@/services/trekService';

export const trekKeys = {
  all: ['treks'] as const,
  lists: () => [...trekKeys.all, 'list'] as const,
  list: (filters: string) => [...trekKeys.lists(), { filters }] as const,
  details: () => [...trekKeys.all, 'detail'] as const,
  detail: (id: string) => [...trekKeys.details(), id] as const,
};

export const useTrek = (trekId: string) => {
  return useQuery({
    queryKey: trekKeys.detail(trekId),
    queryFn: () => trekService.getById(trekId),
    enabled: !!trekId,
  });
};
