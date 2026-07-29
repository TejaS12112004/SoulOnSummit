import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import adminService from '../services/adminService'
import type { AdminFilters, CreateTrekRequest, UpdateTrekRequest } from '../types'

export function useAdminTreks(filters: AdminFilters) {
  return useQuery({
    queryKey: queryKeys.admin.treks.list(filters),
    queryFn: () => adminService.getTreks(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export function useAdminTrek(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.treks.byId(id!),
    queryFn: () => adminService.getTrek(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateTrek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTrekRequest) => adminService.createTrek(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.all() })
    },
  })
}

export function useUpdateTrek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrekRequest }) => adminService.updateTrek(id, data),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(id) })
    },
  })
}

export function useDeleteTrek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteTrek(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(id) })
    },
  })
}

export function usePublishTrek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.publishTrek(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(id) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.treks.all }) // Invalidate public treks
    },
  })
}

export function useUnpublishTrek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.unpublishTrek(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(id) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.treks.all })
    },
  })
}

export function useFeatureTrek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.featureTrek(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.treks.byId(id) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.home.featuredTreks() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.treks.featured })
    },
  })
}
