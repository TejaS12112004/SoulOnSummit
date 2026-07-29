import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters/currency';
import { toTrekDetail } from '@/constants/routes';
import type { HomeUpcomingDepartureViewModel } from '@/types/home';
import type { TrekDifficulty } from '@/types/difficulty';

interface DepartureCardProps {
  departure: HomeUpcomingDepartureViewModel;
  isLast?: boolean;
}

const LOW_SEAT_THRESHOLD = 5;

function DifficultyBadge({ difficulty }: { difficulty: TrekDifficulty }) {
  const styles: Record<TrekDifficulty, { bg: string; color: string }> = {
    EASY:      { bg: '#1F4D3A', color: '#6EE7B7' },
    MODERATE:  { bg: '#78400A', color: '#FCD34D' },
    DIFFICULT: { bg: '#7F1D1D', color: '#FCA5A5' },
    EXTREME:   { bg: '#4C1D95', color: '#C4B5FD' },
  };
  const s = styles[difficulty] ?? { bg: '#374151', color: '#D1D5DB' };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: '9999px',
        padding: '5px 14px',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans-custom)',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {difficulty}
    </span>
  );
}

export function DepartureCard({ departure, isLast }: DepartureCardProps) {
  const navigate = useNavigate();
  const isLowSeats = departure.availableSeats <= LOW_SEAT_THRESHOLD;

  const handleCardClick = () => navigate(toTrekDetail(departure.trekId));

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); } }}
      aria-label={`${departure.trekTitle} departing ${departure.departureDate}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px 28px',
        marginBottom: isLast ? '0' : '10px',
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid rgba(240,235,224,0.07)',
        borderRadius: '14px',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.32)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.2)'}
    >
      {/* Trek name + date — flex 2.5 */}
      <div style={{ flex: '2.5', minWidth: '180px' }}>
        <div style={{
          fontFamily: 'var(--font-sans-custom)',
          fontWeight: 700,
          fontSize: '1rem',
          color: '#F0EBE0',
          marginBottom: '5px',
        }}>
          {departure.trekTitle}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(240,235,224,0.45)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-sans-custom)',
        }}>
          <Calendar style={{ width: '13px', height: '13px' }} aria-hidden="true" />
          {departure.departureDate}
        </div>
      </div>

      {/* Difficulty badge — flex 1 */}
      <div style={{ flex: '1', minWidth: '90px' }}>
        <DifficultyBadge difficulty={departure.difficulty} />
      </div>

      {/* Seats Left — flex 1 */}
      <div style={{ flex: '1', minWidth: '90px' }}>
        <div style={{ fontSize: '0.72rem', color: 'rgba(240,235,224,0.4)', fontFamily: 'var(--font-sans-custom)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Seats Left
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: '1rem',
          color: isLowSeats ? '#F87171' : '#6EE7B7',
          fontFamily: 'var(--font-sans-custom)',
        }}>
          {departure.availableSeats} seats
        </div>
      </div>

      {/* Price — flex 1 */}
      <div style={{ flex: '1', minWidth: '90px' }}>
        <div style={{ fontSize: '0.72rem', color: 'rgba(240,235,224,0.4)', fontFamily: 'var(--font-sans-custom)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          From
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#F0EBE0',
          fontFamily: 'var(--font-sans-custom)',
        }}>
          {formatCurrency(departure.price)}
        </div>
      </div>

      {/* Book Now */}
      <Button
        asChild
        style={{
          background: '#F59E0B',
          color: '#1C2B3A',
          borderRadius: '10px',
          height: '44px',
          paddingLeft: '24px',
          paddingRight: '24px',
          fontSize: '0.88rem',
          fontWeight: 700,
          fontFamily: 'var(--font-sans-custom)',
          border: 'none',
          flexShrink: 0,
        }}
      >
        <Link to={`/booking?trek=${encodeURIComponent(departure.trekTitle)}`} onClick={(e) => e.stopPropagation()}>
          Book Now
        </Link>
      </Button>
    </div>
  );
}
