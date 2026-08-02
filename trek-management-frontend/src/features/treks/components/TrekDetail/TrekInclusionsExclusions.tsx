import { Check, X } from 'lucide-react'
import type { TrekResponseDto } from '@/types/api'

interface TrekInclusionsExclusionsProps {
  trek: TrekResponseDto
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-6 md:p-7 flex-1"

const emptyTextClassName = "text-muted-foreground text-[0.88rem] mt-4 font-inherit"

export function TrekInclusionsExclusions({ trek }: TrekInclusionsExclusionsProps) {
  const inclusions = trek.inclusions ?? []
  const exclusions = trek.exclusions ?? []

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {/* Inclusions */}
      <section className={cardClassName}>
        <h2 className="text-foreground" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, marginBottom: '14px', fontFamily: 'inherit' }}>
          <Check style={{ width: 16, height: 16, color: '#1F4D3A' }} />
          Inclusions
        </h2>
        {inclusions.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {inclusions.map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Check style={{ width: 15, height: 15, color: '#1F4D3A', flexShrink: 0, marginTop: '2px' }} />
                <span className="text-muted-foreground" style={{ fontSize: '0.88rem', lineHeight: 1.5, fontFamily: 'inherit' }}>{item.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={emptyTextClassName}>Inclusions coming soon</p>
        )}
      </section>

      {/* Exclusions */}
      <section className={cardClassName}>
        <h2 className="text-foreground" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, marginBottom: '14px', fontFamily: 'inherit' }}>
          <X style={{ width: 16, height: 16, color: '#EF4444' }} />
          Exclusions
        </h2>
        {exclusions.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exclusions.map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <X style={{ width: 15, height: 15, color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
                <span className="text-muted-foreground" style={{ fontSize: '0.88rem', lineHeight: 1.5, fontFamily: 'inherit' }}>{item.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={emptyTextClassName}>Exclusions coming soon</p>
        )}
      </section>
    </div>
  )
}
