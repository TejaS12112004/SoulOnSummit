import { Link } from 'react-router-dom';
import type { RecentBooking } from '@/hooks/useAdminDashboard';
import { formatCurrency } from '@/utils/formatters/currency';

interface RecentBookingsWidgetProps {
  bookings: RecentBooking[];
}

export function RecentBookingsWidget({ bookings }: RecentBookingsWidgetProps) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      gridColumn: 'span 1'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C2B3A', margin: 0, fontFamily: 'inherit' }}>
          Recent Bookings
        </h2>
        <Link 
          to="/admin/bookings"
          style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1F4D3A', textDecoration: 'none' }}
        >
          View All ↗
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {bookings.map((booking) => (
          <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C2B3A', fontFamily: 'inherit' }}>
                {booking.user}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'inherit', marginTop: '2px' }}>
                {booking.trek} · {booking.date}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C2B3A', fontFamily: 'inherit' }}>
                {formatCurrency(booking.amount)}
              </div>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                padding: '2px 8px', borderRadius: '4px',
                background: booking.status === 'Confirmed' ? '#D1FAE5' : booking.status === 'Pending' ? '#FEF3C7' : '#FEE2E2',
                color: booking.status === 'Confirmed' ? '#059669' : booking.status === 'Pending' ? '#D97706' : '#DC2626'
              }}>
                {booking.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
