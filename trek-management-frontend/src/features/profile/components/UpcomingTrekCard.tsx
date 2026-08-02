import { Calendar, Clock, Users, Rocket, FileText, ArrowRight } from 'lucide-react';
import type { BookingSummaryResponseDto } from '@/types/api';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters/currency';

interface UpcomingTrekCardProps {
  booking: BookingSummaryResponseDto | null;
}

export function UpcomingTrekCard({ booking }: UpcomingTrekCardProps) {
  if (!booking) {
    return (
      <div className="bg-card text-muted-foreground border border-border shadow-sm" style={{
        borderRadius: '16px', padding: '24px', marginTop: '8px', textAlign: 'center'
      }}>
        <Rocket style={{ width: 32, height: 32, color: '#D1D5DB', margin: '0 auto 12px' }} />
        <p style={{ margin: 0, fontWeight: 600 }}>No upcoming treks scheduled.</p>
        <Link to="/treks" className="text-primary" style={{ display: 'inline-block', marginTop: '12px', fontWeight: 700, textDecoration: 'none' }}>
          Explore Treks
        </Link>
      </div>
    );
  }

  // Calculate days left
  const daysLeft = Math.max(0, Math.ceil((new Date(booking.startDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)));

  return (
    <div className="bg-card border border-border shadow-sm" style={{
      borderRadius: '16px',
      padding: '24px',
      marginTop: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Rocket style={{ width: 18, height: 18, color: '#F97316' }} />
        <h2 className="text-foreground" style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'inherit', margin: 0 }}>
          Upcoming Trek
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Trek Image */}
        <div style={{ width: '100%', maxWidth: '240px', height: '160px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
          <img 
            src={booking.trekImageUrl || "https://images.unsplash.com/photo-1522199670076-2852f80289c3?auto=format&fit=crop&q=80&w=400"} 
            alt={booking.trekTitle} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Trek Info & Buttons */}
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="text-foreground" style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'inherit', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              {booking.trekTitle}
            </h3>
            
            <div className="text-muted-foreground" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '0.85rem', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar style={{ width: 14, height: 14, color: '#3B82F6' }} />
                <span>{format(new Date(booking.startDate), 'MMM d, yyyy')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock style={{ width: 14, height: 14, color: '#9CA3AF' }} />
                <span>6 Days</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users style={{ width: 14, height: 14, color: '#A855F7' }} />
                <span>{booking.totalParticipants} Person(s)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            {/* Meta Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div className="bg-muted border border-border" style={{ borderRadius: '10px', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '70px' }}>
                <span className="text-primary" style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1 }}>{daysLeft}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Days Left</span>
              </div>
              
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.7rem', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Booking ID</p>
                <p className="text-foreground" style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{booking.bookingReference}</p>
              </div>

              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.7rem', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Paid</p>
                <p className="text-foreground" style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{formatCurrency(booking.totalAmount)}</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="bg-background text-foreground border border-border hover:bg-muted" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s'
              }}
              >
                <FileText style={{ width: 14, height: 14 }} />
                Invoice
              </button>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                border: 'none',
                padding: '10px 20px', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'background 0.2s'
              }}
              >
                View Details
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
