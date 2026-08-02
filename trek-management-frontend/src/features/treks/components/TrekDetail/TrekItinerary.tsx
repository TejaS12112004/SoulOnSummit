import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { TrekResponseDto } from '@/types/api'

interface TrekItineraryProps {
  trek: TrekResponseDto
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-7 md:p-8"

function ItineraryDay({
  day,
  isOpen,
  onToggle,
}: {
  day: TrekResponseDto['itineraryDays'][0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={isOpen ? 'bg-muted border border-border' : 'bg-card border border-border'}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'background 0.15s',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            background: '#1F4D3A', color: '#fff', fontSize: '0.7rem',
            fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
            textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'inherit',
          }}>
            Day {day.dayNumber}
          </span>
          <span className="text-foreground" style={{ fontWeight: 600, fontSize: '0.93rem', fontFamily: 'inherit' }}>
            {day.title}
          </span>
        </div>
        <ChevronDown
          className="text-muted-foreground"
          style={{
            width: 18, height: 18, flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {isOpen && (
        <div className="text-muted-foreground" style={{ padding: '0 18px 16px', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: 'inherit' }}>
          <p style={{ margin: '0 0 12px' }}>{day.description}</p>
          {(day.accommodation || day.meals || day.altitudeInfo) && (
            <div className="bg-background border border-border text-foreground" style={{
              display: 'flex', flexWrap: 'wrap', gap: '16px',
              borderRadius: '10px',
              padding: '12px 14px', fontSize: '0.83rem',
            }}>
              {day.accommodation && <div><strong>Stay:</strong> {day.accommodation}</div>}
              {day.meals && <div><strong>Meals:</strong> {day.meals}</div>}
              {day.altitudeInfo && <div><strong>Altitude:</strong> {day.altitudeInfo}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function TrekItinerary({ trek }: TrekItineraryProps) {
  const days = trek.itineraryDays ?? []
  const sorted = [...days].sort((a, b) => a.dayNumber - b.dayNumber)
  const [openId, setOpenId] = useState<string | null>(sorted[0]?.id ?? null)

  return (
    <section className={cardClassName}>
      <h2 className="text-foreground" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', fontFamily: 'inherit' }}>
        Detailed Itinerary
      </h2>

      {sorted.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map((day) => (
            <ItineraryDay
              key={day.id}
              day={day}
              isOpen={openId === day.id}
              onToggle={() => setOpenId(openId === day.id ? null : day.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: '10px' }}>
          <span style={{ fontSize: '2rem' }}>🗓️</span>
          <p style={{ fontSize: '0.88rem', fontFamily: 'inherit', margin: 0 }}>Day-wise itinerary coming soon</p>
        </div>
      )}
    </section>
  )
}
