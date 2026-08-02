import { useState, useEffect } from 'react';
import { Mountain, Backpack, CheckCircle2, Trophy } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { UpcomingTrekCard } from '../components/UpcomingTrekCard';
import { RecentBookingsCard } from '../components/RecentBookingsCard';
import { format } from 'date-fns';
import bookingService from '@/services/bookingService';
import type { BookingSummaryResponseDto } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

export function ProfileDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingSummaryResponseDto[]>([]);
  const [_, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  // Compute Stats
  const totalBookings = bookings.length;
  const treksCompleted = bookings.filter(b => b.status === 'COMPLETED').length;
  // Assuming 100 points per completed trek
  const rewardPoints = treksCompleted * 100;
  
  const upcomingBookings = bookings
    .filter(b => b.status === 'CONFIRMED' && new Date(b.startDate).getTime() > new Date().getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const upcomingTrek = upcomingBookings.length > 0 ? upcomingBookings[0] : null;

  // Format Reward Value
  const rewardValue = `₹${rewardPoints.toLocaleString()} value`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Date Header */}
      <div className="flex justify-between items-end border-b border-border pb-3">
        <div>
          <h1 className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            Welcome Back, {user?.firstName || 'Trekker'}!
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: '0.85rem', margin: 0, fontFamily: 'inherit' }}>
            {currentDate}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <StatCard 
          icon={<Mountain style={{ width: 18, height: 18, color: '#B45309' }} />}
          value={upcomingTrek ? format(new Date(upcomingTrek.startDate), 'MMM d') : '-'}
          title="Upcoming Trek"
          subtitle={upcomingTrek ? upcomingTrek.trekTitle : 'No upcoming'}
          dotColor="#10B981"
          valueColor="#10B981"
        />
        <StatCard 
          icon={<Backpack style={{ width: 18, height: 18, color: '#EC4899' }} />}
          value={totalBookings.toString()}
          title="Total Bookings"
          subtitle="All time"
          dotColor="#2563EB"
          valueColor="#2563EB"
        />
        <StatCard 
          icon={<CheckCircle2 style={{ width: 18, height: 18, color: '#10B981' }} />}
          value={treksCompleted.toString()}
          title="Treks Completed"
          subtitle={`Total`}
          dotColor="#10B981"
          valueColor="#10B981"
        />
        <StatCard 
          icon={<Trophy style={{ width: 18, height: 18, color: '#F59E0B' }} />}
          value={rewardPoints.toLocaleString()}
          title="Reward Points"
          subtitle={`= ${rewardValue}`}
          dotColor="#F97316"
          valueColor="#F97316"
        />
      </div>

      {/* Upcoming Trek Section */}
      <UpcomingTrekCard booking={upcomingTrek} />
      
      {/* Recent Bookings Section */}
      <RecentBookingsCard bookings={bookings} />
      
    </div>
  );
}
