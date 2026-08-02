import { useQuery } from '@tanstack/react-query';
import adminService from '@/services/adminService';
import type { AdminDashboardData } from '@/services/adminService';

// Re-export the interfaces for the components
export type {
  DashboardStats,
  RevenueData,
  BookingData,
  CategoryData,
  RecentBooking,
  RecentActivity,
  UpcomingBatch,
  AdminDashboardData
} from '@/services/adminService';

export function useAdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery<AdminDashboardData>({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboardData(),
  });

  return { 
    data, 
    loading: isLoading,
    isError,
    error,
    refetch
  };
}
