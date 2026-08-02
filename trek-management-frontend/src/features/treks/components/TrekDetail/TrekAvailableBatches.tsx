import { CalendarDays } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters/currency'
import type { TrekResponseDto } from '@/types/api'

interface TrekAvailableBatchesProps {
  trek: TrekResponseDto
  selectedBatchId: string | null
  onSelectBatch: (id: string) => void
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-7 md:p-8"

export function TrekAvailableBatches({
  trek,
  selectedBatchId,
  onSelectBatch,
}: TrekAvailableBatchesProps) {
  const departures = trek.departures ?? []
  const sorted = [...departures].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  return (
    <section className={cardClassName}>
      <h2 className="text-foreground" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', fontFamily: 'inherit' }}>
        <CalendarDays style={{ width: 20, height: 20, color: '#3B82F6' }} />
        Available Batch Dates
      </h2>

      {sorted.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map((dep) => {
            const selected = selectedBatchId === dep.id
            return (
              <button
                key={dep.id}
                onClick={() => onSelectBatch(dep.id)}
                className={selected ? 'bg-primary/5 border-primary' : 'bg-card border-border hover:border-primary/50'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Radio circle */}
                  <div className={selected ? 'border-primary' : 'border-muted-foreground'} style={{
                    width: 18, height: 18, borderRadius: '50%',
                    borderWidth: '2px', borderStyle: 'solid',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selected && <div className="bg-primary" style={{ width: 9, height: 9, borderRadius: '50%' }} />}
                  </div>
                  <span className="text-foreground" style={{ fontWeight: 600, fontSize: '0.92rem', fontFamily: 'inherit' }}>
                    {fmtDate(dep.startDate)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span className={dep.availableSeats <= 6 ? 'text-primary' : 'text-muted-foreground'} style={{ fontSize: '0.78rem', fontWeight: 700, fontFamily: 'inherit' }}>
                    {dep.availableSeats} seats
                  </span>
                  <span className="text-foreground" style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'inherit', minWidth: '70px', textAlign: 'right' }}>
                    {formatCurrency(dep.discountPrice ?? dep.price)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="text-muted-foreground" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 0', gap: '10px' }}>
          <span style={{ fontSize: '2rem' }}>📅</span>
          <p style={{ fontSize: '0.88rem', fontFamily: 'inherit', margin: 0 }}>No upcoming batches available</p>
        </div>
      )}
    </section>
  )
}
