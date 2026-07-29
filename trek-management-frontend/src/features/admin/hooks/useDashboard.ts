import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import adminService from '../services/adminService'

export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: () => adminService.getDashboardMetrics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useDashboardCharts() {
  return useQuery({
    queryKey: queryKeys.admin.dashboardCharts(),
    queryFn: () => adminService.getDashboardCharts(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
