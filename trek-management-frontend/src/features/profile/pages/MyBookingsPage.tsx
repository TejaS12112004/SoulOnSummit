import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '@/utils/formatters/currency';
import bookingService from '@/services/bookingService';
import type { BookingSummaryResponseDto } from '@/types/api';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingSummaryResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const location = useLocation();
  const isUpcomingOnly = location.pathname === '/upcoming-treks';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err: any) {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return { bg: '#D1FAE5', text: '#059669' };
      case 'PENDING_PAYMENT': return { bg: '#FEF3C7', text: '#D97706' };
      case 'COMPLETED': return { bg: '#F3F4F6', text: '#4B5563' };
      case 'CANCELLED': return { bg: '#FEE2E2', text: '#DC2626' };
      default: return { bg: '#DBEAFE', text: '#2563EB' };
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}><Loader2 size={32} className="animate-spin" color="#1F4D3A" /></div>;
  }

  if (error) {
    return <div style={{ padding: '24px', color: '#DC2626', background: '#FEE2E2', borderRadius: '12px' }}>{error}</div>;
  }

  const displayedBookings = isUpcomingOnly 
    ? bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.startDate).getTime() > new Date().getTime())
    : bookings;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1 className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 24px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
        {isUpcomingOnly ? 'Upcoming Treks' : 'My Bookings'}
      </h1>
      
      {/* Container Card */}
      <div className="bg-card border border-border shadow-sm" style={{
        borderRadius: '16px',
        padding: '24px 32px',
        overflowX: 'auto',
      }}>
        
        {displayedBookings.length === 0 ? (
          <div className="text-muted-foreground" style={{ textAlign: 'center', padding: '48px' }}>
            {isUpcomingOnly ? "You have no upcoming treks." : "You have no bookings yet."}
          </div>
        ) : (
          <div style={{ minWidth: '850px' }}>
            {/* Table Header */}
            <div className="border-b border-border text-muted-foreground" style={{ 
              display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 1fr 0.8fr 1fr 1fr 1.5fr', 
              gap: '16px', paddingBottom: '16px',
              fontSize: '0.75rem', fontWeight: 700, 
              textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'inherit'
            }}>
              <div>Booking ID</div>
              <div>Trek</div>
              <div>Date</div>
              <div>Persons</div>
              <div>Paid</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {displayedBookings.map((booking, index) => {
                const statusStyle = getStatusStyle(booking.status);
                return (
                  <div key={booking.id} className="border-b border-border text-foreground" style={{ 
                    display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 1fr 0.8fr 1fr 1fr 1.5fr', 
                    gap: '16px', alignItems: 'center', padding: '20px 0',
                    borderBottom: index !== displayedBookings.length - 1 ? undefined : 'none',
                    fontSize: '0.85rem', fontFamily: 'inherit'
                  }}>
                    
                    {/* ID */}
                    <div className="font-semibold text-muted-foreground">
                      {booking.bookingReference}
                    </div>

                    {/* Trek */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="bg-muted border border-border" style={{ width: '40px', height: '28px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={booking.trekImageUrl || "https://images.unsplash.com/photo-1522199670076-2852f80289c3?auto=format&fit=crop&q=80&w=150"} alt={booking.trekTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span className="font-bold text-foreground">{booking.trekTitle}</span>
                    </div>

                    {/* Date & Persons */}
                    <div>{format(new Date(booking.startDate), 'MMM d, yyyy')}</div>
                    <div>{booking.totalParticipants}</div>
                    
                    {/* Paid */}
                    <div className="font-extrabold text-foreground">{formatCurrency(booking.totalAmount)}</div>
                    
                    {/* Status Pill */}
                    <div>
                      <span style={{ 
                        background: statusStyle.bg, color: statusStyle.text, 
                        padding: '6px 12px', borderRadius: '999px', fontSize: '0.75rem', 
                        fontWeight: 800, textTransform: 'capitalize' 
                      }}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="bg-background text-primary border border-primary hover:bg-primary/5" style={{
                        padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem',
                        fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s'
                      }}
                      >
                        View
                      </button>

                      {booking.status === 'COMPLETED' && (
                        <button className="bg-background text-muted-foreground border border-border hover:bg-muted" style={{
                          padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem',
                          fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        >
                          Review
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
