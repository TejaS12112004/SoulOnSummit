import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { AdminStatCard } from '../components/AdminStatCard';
import { RevenueChart } from '../components/charts/RevenueChart';
import { BookingsChart } from '../components/charts/BookingsChart';
import { CategoryChart } from '../components/charts/CategoryChart';
import { RecentBookingsWidget } from '../components/widgets/RecentBookingsWidget';
import { RecentActivityWidget } from '../components/widgets/RecentActivityWidget';
import { UpcomingBatchesWidget } from '../components/widgets/UpcomingBatchesWidget';
import { Wallet, Backpack, Users, CalendarDays, Bell } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters/currency';

import { useNavigate } from 'react-router-dom';

export function AdminDashboardPage() {
  const { data, loading } = useAdminDashboard();
  const navigate = useNavigate();

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="w-8 h-8 rounded-full border-2 border-[#1F4D3A] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1C2B3A', margin: '0 0 4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: 0, fontFamily: 'inherit' }}>
            January 9, 2025 — Good morning! 👋
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ 
            width: '40px', height: '40px', borderRadius: '12px', background: '#fff', 
            border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', cursor: 'pointer'
          }}>
            <Bell style={{ width: 18, height: 18, color: '#F59E0B' }} />
            <span style={{ 
              position: 'absolute', top: -4, right: -4, background: '#EF4444', color: '#fff',
              fontSize: '0.6rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              3
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/admin/treks/new')}
            style={{
            background: '#F59E0B', color: '#fff', border: 'none', padding: '0 20px',
            borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'inherit',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            + Add Trek
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <AdminStatCard 
          icon={<Wallet style={{ width: 20, height: 20, color: '#F59E0B' }} />}
          iconBgColor="#FEF3C7"
          value={formatCurrency(data?.stats?.totalRevenue || 0)}
          label="Total Revenue"
          growth={0}
        />
        <AdminStatCard 
          icon={<Backpack style={{ width: 20, height: 20, color: '#EC4899' }} />}
          iconBgColor="#FDF2F8"
          value={data?.stats?.totalBookings || 0}
          label="Total Bookings"
          growth={0}
        />
        <AdminStatCard 
          icon={<Users style={{ width: 20, height: 20, color: '#3B82F6' }} />}
          iconBgColor="#EFF6FF"
          value={(data?.stats?.activeUsers || 0).toLocaleString()}
          label="Total Users"
          growth={0}
        />
        <AdminStatCard 
          icon={<CalendarDays style={{ width: 20, height: 20, color: '#8B5CF6' }} />}
          iconBgColor="#F5F3FF"
          value={data?.stats?.upcomingDepartures || 0}
          label="Upcoming Departures"
          growth={0}
        />
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <RevenueChart data={data?.revenueTimeline || []} />
        <CategoryChart data={data?.trekCategories || []} />
      </div>

      {/* Bookings Bar Chart Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <BookingsChart data={data?.monthlyBookings || []} />
      </div>

      {/* Widgets Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <RecentBookingsWidget bookings={data?.recentBookings || []} />
        <RecentActivityWidget activities={data?.recentActivity || []} />
      </div>

      {/* Full width table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <UpcomingBatchesWidget batches={data?.upcomingBatches || []} />
      </div>
    </>
  );
}
