import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { BookingSummaryResponseDto } from '@/types/api';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters/currency';

interface RecentBookingsCardProps {
  bookings: BookingSummaryResponseDto[];
}

export function RecentBookingsCard({ bookings }: RecentBookingsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return '#059669'; // emerald-600
      case 'PENDING_PAYMENT': return '#F59E0B'; // amber-500
      case 'COMPLETED': return '#4B5563'; // gray-600
      case 'CANCELLED': return '#DC2626'; // red-600
      default: return '#3B82F6'; // blue-500
    }
  };

  return (
    <div className="bg-card border border-border shadow-sm" style={{
      borderRadius: '16px',
      padding: '24px',
      marginTop: '8px',
      overflowX: 'auto',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 className="text-foreground" style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'inherit', margin: 0 }}>
          Recent Bookings
        </h2>
        <Link 
          to="/profile/bookings"
          className="text-primary hover:text-primary/80"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '0.85rem', fontWeight: 700, 
            textDecoration: 'none', fontFamily: 'inherit', transition: 'color 0.2s'
          }}
        >
          View All <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-muted-foreground" style={{ textAlign: 'center', padding: '24px', fontSize: '0.9rem' }}>
          No recent bookings found.
        </div>
      ) : (
        <div style={{ minWidth: '700px' }}>
          {/* Table Header */}
          <div className="border-b border-border text-muted-foreground" style={{ 
            display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 1fr 0.8fr 1fr 1fr', 
            gap: '16px', paddingBottom: '12px',
            fontSize: '0.75rem', fontWeight: 700, 
            textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'inherit'
          }}>
            <div>Booking ID</div>
            <div>Trek</div>
            <div>Date</div>
            <div>Persons</div>
            <div>Paid</div>
            <div>Status</div>
          </div>

          {/* Table Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {bookings.slice(0, 5).map((booking, index) => (
              <div key={booking.id} className="text-foreground border-b border-border" style={{ 
                display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 1fr 0.8fr 1fr 1fr', 
                gap: '16px', alignItems: 'center', padding: '16px 0',
                borderBottom: index !== Math.min(bookings.length, 5) - 1 ? undefined : 'none',
                fontSize: '0.85rem', fontFamily: 'inherit'
              }}>
                
                <div className="font-semibold text-muted-foreground">
                  {booking.bookingReference}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="bg-muted border border-border" style={{ width: '40px', height: '28px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={booking.trekImageUrl || "https://images.unsplash.com/photo-1522199670076-2852f80289c3?auto=format&fit=crop&q=80&w=150"} alt={booking.trekTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span className="font-bold text-foreground">{booking.trekTitle}</span>
                </div>

                <div>{format(new Date(booking.startDate), 'MMM d, yyyy')}</div>
                
                <div>{booking.totalParticipants}</div>
                
                <div className="font-bold text-foreground">{formatCurrency(booking.totalAmount)}</div>
                
                <div style={{ fontWeight: 700, color: getStatusColor(booking.status) }}>
                  {booking.status}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
