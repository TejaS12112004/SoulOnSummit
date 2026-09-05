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
    <div className="flex flex-col">
      <h1 className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 24px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
        {isUpcomingOnly ? 'Upcoming Treks' : 'My Bookings'}
      </h1>
      
      {displayedBookings.length === 0 ? (
        <div className="bg-card border border-border shadow-sm rounded-2xl p-12 text-center text-muted-foreground">
          {isUpcomingOnly ? "You have no upcoming treks." : "You have no bookings yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedBookings.map((booking) => {
            const statusStyle = getStatusStyle(booking.status);
            return (
              <div key={booking.id} className="bg-card border border-border shadow-sm rounded-2xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Trek info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-muted border border-border rounded-lg overflow-hidden flex-shrink-0" style={{ width: '52px', height: '40px' }}>
                      <img 
                        src={booking.trekImageUrl || "https://images.unsplash.com/photo-1522199670076-2852f80289c3?auto=format&fit=crop&q=80&w=150"} 
                        alt={booking.trekTitle} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-foreground text-[0.9rem] truncate">{booking.trekTitle}</div>
                      <div className="text-muted-foreground text-[0.75rem] font-semibold">{booking.bookingReference}</div>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-3 text-[0.8rem]">
                    <div className="text-muted-foreground">
                      {format(new Date(booking.startDate), 'MMM d, yyyy')}
                    </div>
                    <div className="text-muted-foreground">
                      {booking.totalParticipants} {booking.totalParticipants === 1 ? 'person' : 'persons'}
                    </div>
                    <div className="font-extrabold text-foreground">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <span style={{ 
                      background: statusStyle.bg, color: statusStyle.text, 
                      padding: '5px 10px', borderRadius: '999px', fontSize: '0.72rem', 
                      fontWeight: 800, textTransform: 'capitalize', whiteSpace: 'nowrap',
                    }}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="bg-background text-primary border border-primary hover:bg-primary/5" style={{
                      padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem',
                      fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s'
                    }}>
                      View
                    </button>

                    {booking.status === 'COMPLETED' && (
                      <button className="bg-background text-muted-foreground border border-border hover:bg-muted" style={{
                        padding: '6px 14px', borderRadius: '8px', fontSize: '0.75rem',
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                      }}>
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
