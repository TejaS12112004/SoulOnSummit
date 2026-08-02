import { PhoneCall, Tag, Check, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/formatters/currency'
import type { TrekResponseDto, DepartureResponseDto } from '@/types/api'

interface BookingSidebarProps {
  trek: TrekResponseDto
  selectedBatch: DepartureResponseDto | null
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-6 mb-4"

export function BookingSidebar({ trek, selectedBatch }: BookingSidebarProps) {
  const navigate = useNavigate()
  const price = selectedBatch ? selectedBatch.price : (trek.lowestPrice ?? 0)
  const originalPrice = price + 3000

  return (
    <div>
      {/* ── Price Card ── */}
      <div className={cardClassName}>
        {/* Strikethrough price */}
        <p className="text-muted-foreground" style={{ fontSize: '0.82rem', textDecoration: 'line-through', marginBottom: '2px', fontFamily: 'inherit' }}>
          {formatCurrency(originalPrice)} /person
        </p>

        {/* Main price */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '12px' }}>
          <span className="text-foreground" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, fontFamily: 'inherit' }}>
            {formatCurrency(price)}
          </span>
          <span className="text-muted-foreground" style={{ fontSize: '0.85rem', paddingBottom: '2px', fontFamily: 'inherit' }}>per person</span>
        </div>

        {/* Save badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', borderRadius: '999px', padding: '5px 12px', marginBottom: '16px' }}>
          <Tag style={{ width: 12, height: 12, color: '#B45309' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', fontFamily: 'inherit' }}>Save {formatCurrency(3000)}</span>
        </div>

        {/* Batch info box */}
        <div className="bg-muted" style={{ borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="text-muted-foreground" style={{ fontSize: '0.83rem', fontFamily: 'inherit' }}>Selected Batch</span>
            <span className="text-foreground" style={{ fontSize: '0.83rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {selectedBatch ? fmtDate(selectedBatch.startDate) : 'None selected'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="text-muted-foreground" style={{ fontSize: '0.83rem', fontFamily: 'inherit' }}>Seats Left</span>
            <span className={selectedBatch && selectedBatch.availableSeats <= 8 ? "text-primary" : "text-muted-foreground"} style={{ fontSize: '0.83rem', fontWeight: 700, fontFamily: 'inherit' }}>
              {selectedBatch ? `${selectedBatch.availableSeats} only!` : '--'}
            </span>
          </div>
        </div>

        {/* Book Now button */}
        <button
          onClick={() => selectedBatch && navigate(`/book/${trek.id}?batch=${selectedBatch.id}`)}
          disabled={!selectedBatch}
          style={{
            width: '100%', background: selectedBatch ? '#F59E0B' : '#D1D5DB',
            color: '#fff', fontWeight: 700, fontSize: '0.92rem',
            border: 'none', borderRadius: '12px', padding: '14px',
            marginBottom: '10px', cursor: selectedBatch ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
          }}
        >
          {selectedBatch ? `Book Now — ${fmtDate(selectedBatch.startDate)}` : 'Select a Batch to Book'}
        </button>

        {/* Call Expert button */}
        <button style={{
          width: '100%', background: '#1F4D3A', color: '#fff',
          fontWeight: 700, fontSize: '0.92rem', border: 'none',
          borderRadius: '12px', padding: '14px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: '8px',
          cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px',
        }}>
          <PhoneCall style={{ width: 16, height: 16, color: '#F9A8D4' }} />
          Call Expert
        </button>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          {['Free\nCancellation', 'Instant\nConfirm', '24/7\nSupport'].map((label) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <Check className="text-muted-foreground" style={{ width: 14, height: 14 }} />
              <span className="text-muted-foreground" style={{ fontSize: '0.62rem', fontFamily: 'inherit', whiteSpace: 'pre-line', lineHeight: 1.3 }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Why Book With Us ── */}
      <div style={{ background: '#1F4D3A', borderRadius: '16px', padding: '24px', color: '#fff' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, marginBottom: '16px', fontFamily: 'inherit' }}>
          <Trophy style={{ width: 18, height: 18, color: '#FBBF24' }} />
          Why Book With Us
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            'Certified & experienced trek leaders',
            'Comprehensive safety gear',
            'No hidden charges ever',
            '4.9★ rating from 10,000+ trekkers',
          ].map((text) => (
            <li key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check style={{ width: 15, height: 15, color: '#FBBF24', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.88rem', color: '#D1FAE5', fontFamily: 'inherit' }}>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
