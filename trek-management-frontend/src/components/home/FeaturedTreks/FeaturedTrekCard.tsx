import { Link } from 'react-router-dom';
import { Star, MapPin, Clock3 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { toTrekDetail } from '@/constants/routes';
import { formatCurrency } from '@/utils/formatters/currency';
import type { HomeFeaturedTrekViewModel } from '@/types/home';
import type { TrekDifficulty } from '@/types/difficulty';

interface FeaturedTrekCardProps {
  trek: HomeFeaturedTrekViewModel;
}

// Removed hardcoded background

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
        padding: '4px 10px',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans-custom)',
        display: 'inline-block',
      }}
    >
      {difficulty}
    </span>
  );
}

export function FeaturedTrekCard({ trek }: FeaturedTrekCardProps) {
  const isLowSeats = trek.seatsLeft <= 5;

  return (
    <Link
      to={toTrekDetail(trek.id)}
      className="group flex flex-col bg-card rounded-[16px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl border border-border hover:-translate-y-1"
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#1A1A0F' }}>
        <img
          src={trek.coverImageUrl}
          alt={trek.title}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            display: 'block',
          }}
          className="group-hover:[transform:scale(1.06)]"
        />
        {/* Dark gradient at bottom of image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />
        {/* Difficulty badge — top left */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <DifficultyBadge difficulty={trek.difficulty} />
        </div>
        {/* Altitude badge — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(6px)',
            borderRadius: '8px',
            padding: '4px 10px',
            color: '#1A1A0F',
            fontSize: '0.75rem',
            fontWeight: 600,
            fontFamily: 'var(--font-sans-custom)',
          }}
        >
          {trek.maxAltitude.toLocaleString()} ft
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '0', flexGrow: 1 }}>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-display-custom)',
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: '4px',
          }}
          className="text-foreground"
        >
          {trek.title}
        </h3>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--font-sans-custom)' }}>
            {formatCurrency(trek.price)}
          </span>
          <span className="text-[0.8rem] text-muted-foreground line-through font-sans">
            {formatCurrency(trek.originalPrice)}
          </span>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <MapPin style={{ width: '13px', height: '13px', color: '#F87171', flexShrink: 0 }} />
          <span className="text-[0.82rem] text-muted-foreground font-sans overflow-hidden text-ellipsis whitespace-nowrap">
            {trek.location}
          </span>
        </div>

        {/* Duration + Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <span className="flex items-center gap-[5px] text-[0.8rem] text-muted-foreground font-sans">
            <Clock3 style={{ width: '13px', height: '13px' }} />
            {trek.durationDays} Days
          </span>
          <span className="flex items-center gap-[4px] text-[0.8rem] text-muted-foreground font-sans">
            <Star style={{ width: '12px', height: '12px', fill: '#F59E0B', color: '#F59E0B' }} />
            <span className="text-foreground font-semibold">{trek.rating}</span>
            <span>({trek.reviewCount})</span>
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-[14px]" />

        {/* Next Batch + Seats Left */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div className="text-[0.7rem] text-muted-foreground font-sans mb-[2px] uppercase tracking-wider">
              Next Batch
            </div>
            <div className="text-[0.88rem] font-bold text-foreground font-sans">
              {trek.nextBatch}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="text-[0.7rem] text-muted-foreground font-sans mb-[2px] uppercase tracking-wider">
              Seats Left
            </div>
            <div className={cn("text-[0.88rem] font-bold font-sans", isLowSeats ? 'text-red-500' : 'text-foreground')}>
              {trek.seatsLeft} only!
            </div>
          </div>
        </div>

        {/* View Details button */}
        <div
          style={{
            background: '#1F4D3A',
            color: '#F0EBE0',
            borderRadius: '8px',
            padding: '11px',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: 700,
            fontFamily: 'var(--font-sans-custom)',
            transition: 'background 0.2s ease',
            marginTop: 'auto',
          }}
          className="group-hover:[background:#2a6650]"
        >
          View Details
        </div>
      </div>
    </Link>
  );
}
