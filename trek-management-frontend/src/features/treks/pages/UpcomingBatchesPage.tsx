import { useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUpcomingBatches } from '@/hooks/useUpcomingBatches';
import { toTrekDetail } from '@/constants/routes';
import { formatCurrency } from '@/utils/formatters/currency';
import type { UpcomingBatchResponse } from '@/types/api';
import type { TrekDifficulty } from '@/types/difficulty';

import type { Variants } from 'framer-motion';

// ── Motion constants ─────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const PAGE_SIZE = 20;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate + 'T00:00:00'); // treat as local date
  const end   = new Date(endDate   + 'T00:00:00');
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const startStr = start.toLocaleDateString('en-IN', opts);
  const endStr   = end.toLocaleDateString('en-IN', { ...opts, year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

function getMonthLabel(startDate: string): string {
  const d = new Date(startDate + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function groupByMonth(batches: UpcomingBatchResponse[]): Map<string, UpcomingBatchResponse[]> {
  const map = new Map<string, UpcomingBatchResponse[]>();
  for (const b of batches) {
    const label = getMonthLabel(b.startDate);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(b);
  }
  return map;
}

// ── Sub-components ────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<TrekDifficulty, { bg: string; color: string }> = {
  EASY:      { bg: 'rgba(34,197,94,0.15)',   color: '#22c55e' },
  MODERATE:  { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  DIFFICULT: { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
  EXTREME:   { bg: 'rgba(168,85,247,0.15)',  color: '#a855f7' },
};

function DifficultyBadge({ difficulty }: { difficulty: TrekDifficulty }) {
  const s = DIFFICULTY_STYLES[difficulty] ?? { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: '9999px',
        padding: '4px 12px',
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-sans-custom)',
        whiteSpace: 'nowrap',
      }}
    >
      {difficulty}
    </span>
  );
}

function AvailabilityBadge({ batch }: { batch: UpcomingBatchResponse }) {
  if (batch.soldOut) {
    return (
      <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-sans-custom)' }}>
        Sold Out
      </span>
    );
  }
  if (batch.fillingFast) {
    return (
      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-sans-custom)' }}>
        🔥 Filling Fast · {batch.availableSeats} left
      </span>
    );
  }
  const isLow = batch.availableSeats <= 5;
  return (
    <span style={{ color: isLow ? '#fb923c' : '#6ee7b7', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-sans-custom)' }}>
      {batch.availableSeats} seats left
    </span>
  );
}

function PriceDisplay({ batch }: { batch: UpcomingBatchResponse }) {
  const hasDiscount = batch.discountPrice !== null && batch.discountPrice < batch.price;
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: 'var(--font-display-custom)', fontSize: '1.25rem', fontWeight: 800, color: '#F0EBE0' }}>
        {formatCurrency(hasDiscount ? batch.discountPrice! : batch.price)}
      </div>
      {hasDiscount && (
        <div style={{ fontFamily: 'var(--font-sans-custom)', fontSize: '0.78rem', color: 'rgba(240,235,224,0.45)', textDecoration: 'line-through' }}>
          {formatCurrency(batch.price)}
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-sans-custom)', fontSize: '0.7rem', color: 'rgba(240,235,224,0.4)', marginTop: '2px' }}>
        per person
      </div>
    </div>
  );
}

interface BatchCardProps {
  batch: UpcomingBatchResponse;
}

function BatchCard({ batch }: BatchCardProps) {
  const navigate = useNavigate();
  const isSoldOut = batch.soldOut;

  // Book Now navigates to /book/:trekId?batch=:departureId — exactly as BookingPage expects
  const bookingUrl = `/book/${batch.trekId}?batch=${batch.departureId}`;

  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(240,235,224,0.08)',
        borderRadius: '16px',
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(240,235,224,0.15)' }}
      onClick={() => navigate(toTrekDetail(batch.trekId))}
    >
      {/* Left: Trek info */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: 0 }}>
        {/* Cover thumbnail */}
        {batch.coverImageUrl ? (
          <img
            src={batch.coverImageUrl}
            alt={batch.trekTitle}
            style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: '64px', height: '64px', borderRadius: '12px', flexShrink: 0,
              background: 'linear-gradient(135deg, #1F4D3A, #0D2B1F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            }}
          >
            🏔️
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          {/* Trek name + difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display-custom)', fontWeight: 700, fontSize: '1.05rem', color: '#F0EBE0', whiteSpace: 'nowrap' }}>
              {batch.trekTitle}
            </span>
            <DifficultyBadge difficulty={batch.difficulty} />
          </div>

          {/* Date range + Duration */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(240,235,224,0.65)', fontSize: '0.8rem', fontFamily: 'var(--font-sans-custom)' }}>
              <Calendar style={{ width: '13px', height: '13px' }} aria-hidden="true" />
              {formatDateRange(batch.startDate, batch.endDate)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(240,235,224,0.65)', fontSize: '0.8rem', fontFamily: 'var(--font-sans-custom)' }}>
              <Clock style={{ width: '13px', height: '13px' }} aria-hidden="true" />
              {batch.durationDays} days
            </span>
            {batch.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(240,235,224,0.65)', fontSize: '0.8rem', fontFamily: 'var(--font-sans-custom)' }}>
                <MapPin style={{ width: '13px', height: '13px' }} aria-hidden="true" />
                {batch.location}{batch.state ? `, ${batch.state}` : ''}
              </span>
            )}
          </div>

          {/* Availability */}
          <AvailabilityBadge batch={batch} />
        </div>
      </div>

      {/* Right: Price + Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
        <PriceDisplay batch={batch} />

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            asChild
            variant="outline"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderColor: 'rgba(240,235,224,0.2)',
              color: 'rgba(240,235,224,0.8)',
              background: 'transparent',
              fontSize: '0.78rem',
              fontWeight: 600,
              height: '36px',
              padding: '0 14px',
              borderRadius: '8px',
            }}
          >
            <Link to={toTrekDetail(batch.trekId)} onClick={(e) => e.stopPropagation()}>
              View Trek
            </Link>
          </Button>

          {!isSoldOut && (
            <Button
              asChild
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#F59E0B',
                color: '#1C2B3A',
                fontSize: '0.78rem',
                fontWeight: 700,
                height: '36px',
                padding: '0 14px',
                borderRadius: '8px',
              }}
            >
              <Link to={bookingUrl} onClick={(e) => e.stopPropagation()}>
                Book Now
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Filters bar ───────────────────────────────────────────────────────────────

const DIFFICULTIES: { label: string; value: TrekDifficulty | '' }[] = [
  { label: 'All Difficulties', value: '' },
  { label: 'Easy', value: 'EASY' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'Difficult', value: 'DIFFICULT' },
  { label: 'Extreme', value: 'EXTREME' },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function UpcomingBatchesPage() {
  const shouldReduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') ?? '0', 10);
  const difficultyFilter = (searchParams.get('difficulty') ?? '') as TrekDifficulty | '';

  const { data, isLoading, isError } = useUpcomingBatches({ page, size: PAGE_SIZE });

  // Derive available months from current page data
  const filteredBatches = useMemo(() => {
    if (!data?.content) return [];
    if (!difficultyFilter) return data.content;
    return data.content.filter((b) => b.difficulty === difficultyFilter);
  }, [data, difficultyFilter]);

  const groupedByMonth = useMemo(() => groupByMonth(filteredBatches), [filteredBatches]);

  // ── Filter handlers ─────────────────────────────────────────────────────────
  function handleDifficultyChange(value: TrekDifficulty | '') {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('difficulty', value);
      else next.delete('difficulty');
      next.set('page', '0'); // reset page on filter change
      return next;
    });
  }

  function handlePageChange(newPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0D2B1F' }}>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D2B1F 0%, #1F4D3A 60%, #0a1f16 100%)',
          padding: '80px 24px 64px',
        }}
        aria-label="Upcoming Batches"
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M0 400 L200 220 L380 310 L560 160 L760 280 L960 120 L1160 250 L1340 150 L1440 220 L1440 400 Z" fill="rgba(255,255,255,0.02)" />
          <path d="M0 400 L150 270 L300 360 L480 180 L660 310 L850 160 L1050 290 L1260 190 L1440 270 L1440 400 Z" fill="rgba(245,158,11,0.03)" />
        </svg>

        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <motion.div variants={shouldReduceMotion ? {} : stagger} initial="hidden" animate="visible">
            <motion.div
              variants={shouldReduceMotion ? {} : fadeUp}
              style={{ color: '#F59E0B', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'var(--font-sans-custom)', marginBottom: '14px' }}
            >
              📅 Upcoming Batches
            </motion.div>
            <motion.h1
              variants={shouldReduceMotion ? {} : fadeUp}
              style={{
                fontFamily: 'var(--font-display-custom)',
                fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                fontWeight: 800,
                color: '#F0EBE0',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
              }}
            >
              Book Your Next<br />
              <span style={{ color: '#F59E0B' }}>Himalayan Departure</span>
            </motion.h1>
            <motion.p
              variants={shouldReduceMotion ? {} : fadeUp}
              style={{ color: 'rgba(240,235,224,0.65)', fontSize: '1rem', lineHeight: 1.7, fontFamily: 'var(--font-sans-custom)', maxWidth: '560px' }}
            >
              Every batch listed here is a real, confirmed departure — complete with dates,
              seats, and pricing. No mock data. No empty promises. Just mountains.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Filters + Content ── */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Filters bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '36px',
            flexWrap: 'wrap',
          }}
          aria-label="Filter upcoming batches"
        >
          <Filter style={{ width: '16px', height: '16px', color: 'rgba(240,235,224,0.5)' }} aria-hidden="true" />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => handleDifficultyChange(d.value)}
                aria-pressed={difficultyFilter === d.value}
                style={{
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans-custom)',
                  border: '1px solid',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: difficultyFilter === d.value ? '#F59E0B' : 'transparent',
                  borderColor: difficultyFilter === d.value ? '#F59E0B' : 'rgba(240,235,224,0.2)',
                  color: difficultyFilter === d.value ? '#1C2B3A' : 'rgba(240,235,224,0.7)',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>

          {totalElements > 0 && !isLoading && (
            <span style={{ marginLeft: 'auto', color: 'rgba(240,235,224,0.4)', fontSize: '0.78rem', fontFamily: 'var(--font-sans-custom)' }}>
              {totalElements} departure{totalElements !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} aria-live="polite" aria-label="Loading departures">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: '104px',
                  borderRadius: '16px',
                  background: 'rgba(240,235,224,0.05)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && !isLoading && (
          <div
            style={{
              textAlign: 'center',
              padding: '64px 24px',
              color: 'rgba(240,235,224,0.6)',
              fontFamily: 'var(--font-sans-custom)',
            }}
            role="alert"
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <p style={{ fontSize: '1rem' }}>
              Unable to load upcoming batches. Please try again shortly.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredBatches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: 'rgba(240,235,224,0.6)', fontFamily: 'var(--font-sans-custom)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏔️</div>
            <p style={{ fontSize: '1rem', marginBottom: '8px' }}>
              {difficultyFilter
                ? `No ${difficultyFilter.toLowerCase()} departures match the current filters.`
                : 'No upcoming departures are currently available.'}
            </p>
            {difficultyFilter && (
              <button
                onClick={() => handleDifficultyChange('')}
                style={{
                  marginTop: '16px',
                  background: 'transparent',
                  color: '#F59E0B',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans-custom)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grouped batches */}
        {!isLoading && !isError && filteredBatches.length > 0 && (
          <motion.div
            variants={shouldReduceMotion ? {} : stagger}
            initial="hidden"
            animate="visible"
          >
            {Array.from(groupedByMonth.entries()).map(([month, batches]) => (
              <div key={month} style={{ marginBottom: '48px' }}>
                {/* Month header */}
                <motion.div
                  variants={shouldReduceMotion ? {} : fadeUp}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-display-custom)',
                      fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)',
                      fontWeight: 700,
                      color: '#F0EBE0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {month}
                  </h2>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(240,235,224,0.1)' }} aria-hidden="true" />
                  <span style={{ color: 'rgba(240,235,224,0.35)', fontSize: '0.75rem', fontFamily: 'var(--font-sans-custom)', whiteSpace: 'nowrap' }}>
                    {batches.length} batch{batches.length !== 1 ? 'es' : ''}
                  </span>
                </motion.div>

                {/* Batch cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {batches.map((batch) => (
                    <BatchCard key={batch.departureId} batch={batch} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '48px',
            }}
            aria-label="Pagination"
          >
            <Button
              variant="outline"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
              style={{
                borderColor: 'rgba(240,235,224,0.2)',
                color: 'rgba(240,235,224,0.8)',
                background: 'transparent',
                height: '40px',
                width: '40px',
                padding: 0,
                borderRadius: '10px',
              }}
              aria-label="Previous page"
            >
              <ChevronLeft style={{ width: '18px', height: '18px' }} />
            </Button>

            <span style={{ color: 'rgba(240,235,224,0.6)', fontSize: '0.85rem', fontFamily: 'var(--font-sans-custom)' }}>
              Page {page + 1} of {totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
              style={{
                borderColor: 'rgba(240,235,224,0.2)',
                color: 'rgba(240,235,224,0.8)',
                background: 'transparent',
                height: '40px',
                width: '40px',
                padding: 0,
                borderRadius: '10px',
              }}
              aria-label="Next page"
            >
              <ChevronRight style={{ width: '18px', height: '18px' }} />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
