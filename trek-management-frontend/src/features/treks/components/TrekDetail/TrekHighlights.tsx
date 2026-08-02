import { Check } from 'lucide-react'
import type { HighlightResponseDto } from '@/types/api'

interface TrekHighlightsProps {
  highlights: HighlightResponseDto[]
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-7 md:p-8"

const emptyStateClassName = "text-muted-foreground flex flex-col items-center justify-center py-8 gap-2"

export function TrekHighlights({ highlights }: TrekHighlightsProps) {
  return (
    <section className={cardClassName}>
      <h2 className="text-foreground" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', fontFamily: 'inherit' }}>
        Trek Highlights
      </h2>

      {highlights && highlights.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {highlights.map((item) => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Check style={{ width: 16, height: 16, color: '#1F4D3A', flexShrink: 0, marginTop: '2px' }} />
              <span className="text-muted-foreground" style={{ fontSize: '0.93rem', lineHeight: 1.6, fontFamily: 'inherit' }}>
                {item.title}
                {item.description ? (
                  <span className="text-muted-foreground/70" style={{ display: 'block', fontSize: '0.82rem', marginTop: '2px' }}>
                    {item.description}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className={emptyStateClassName}>
          <span style={{ fontSize: '2rem' }}>🏔️</span>
          <p style={{ fontSize: '0.88rem', fontFamily: 'inherit', margin: 0 }}>Highlights coming soon</p>
        </div>
      )}
    </section>
  )
}
