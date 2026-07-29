import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import adminService from '../services/adminService'
import type { CreateDepartureRequest } from '../types'

export function useAdminDepartures(trekId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.departures.byTrek(trekId!),
    queryFn: () => adminService.getDepartures(trekId!),
    enabled: !!trekId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminDeparture(trekId: string | undefined, depId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.departures.byId(trekId!, depId!),
    queryFn: () => adminService.getDeparture(trekId!, depId!),
    enabled: !!trekId && !!depId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateDeparture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trekId, data }: { trekId: string; data: CreateDepartureRequest }) =>
      adminService.createDeparture(trekId, data),
    onSuccess: (_, { trekId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byTrek(trekId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(trekId) })
    },
  })
}

export function useUpdateDeparture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trekId, depId, data }: { trekId: string; depId: string; data: Partial<CreateDepartureRequest> }) =>
      adminService.updateDeparture(trekId, depId, data),
    onSuccess: (_, { trekId, depId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byTrek(trekId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byId(trekId, depId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(trekId) })
    },
  })
}

export function useDeleteDeparture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trekId, depId }: { trekId: string; depId: string }) => adminService.deleteDeparture(trekId, depId),
    onSuccess: (_, { trekId, depId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byTrek(trekId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byId(trekId, depId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(trekId) })
    },
  })
}

export function useDuplicateDeparture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trekId, depId }: { trekId: string; depId: string }) => adminService.duplicateDeparture(trekId, depId),
    onSuccess: (_, { trekId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byTrek(trekId) })
    },
  })
}

export function useChangeDepartureStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trekId, depId, status }: { trekId: string; depId: string; status: string }) =>
      adminService.changeDepartureStatus(trekId, depId, status),
    onSuccess: (_, { trekId, depId }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byTrek(trekId) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.departures.byId(trekId, depId) })
    },
  })
}
