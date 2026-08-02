import apiClient from '@/api/apiClient';
import type { ApiResponse } from '@/types/api';

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  upcomingDepartures: number;
}

export interface RevenueData { month: string; amount: number; }
export interface BookingData { month: string; count: number; }
export interface CategoryData { name: string; value: number; color: string; }

export interface RecentBooking {
  id: string;
  user: string;
  trek: string;
  date: string;
  amount: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | string;
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'user' | string;
  message: string;
  timeAgo: string;
}

export interface UpcomingBatch {
  id: string;
  trekName: string;
  date: string;
  registered: number;
  capacity: number;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  revenueTimeline: RevenueData[];
  monthlyBookings: BookingData[];
  trekCategories: CategoryData[];
  recentBookings: RecentBooking[];
  recentActivity: RecentActivity[];
  upcomingBatches: UpcomingBatch[];
}

class AdminService {
  async getDashboardData(): Promise<AdminDashboardData> {
    const response = await apiClient.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
    return response.data.data;
  }
}

export default new AdminService();
