import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import adminService from '../services/adminService'
import type { AdminFilters, UpdateBookingRequest } from '../types'

export function useAdminBookings(filters?: AdminFilters) {
  return useQuery({
    queryKey: queryKeys.admin.bookings.list(filters || {}),
    queryFn: () => adminService.getBookings(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export function useAdminBooking(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.bookings.byId(id!),
    queryFn: () => adminService.getBooking(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequest }) => adminService.updateBooking(id, data),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.bookings.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.bookings.byId(id) })
    },
  })
}
