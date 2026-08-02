import type { PackingItemResponseDto } from '@/types/api'

interface TrekThingsToCarryProps {
  items: PackingItemResponseDto[]
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-7 md:p-8"

export function TrekThingsToCarry({ items }: TrekThingsToCarryProps) {
  return (
    <section className={cardClassName}>
      <h2 className="text-foreground" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', fontFamily: 'inherit' }}>
        <span>🎒</span> Things to Carry
      </h2>

      {items && items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 32px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ marginTop: '7px', width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
              <span className="text-muted-foreground" style={{ fontSize: '0.88rem', lineHeight: 1.5, fontFamily: 'inherit' }}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 0', gap: '10px' }}>
          <span style={{ fontSize: '2rem' }}>🏕️</span>
          <p style={{ fontSize: '0.88rem', fontFamily: 'inherit', margin: 0 }}>Packing list coming soon</p>
        </div>
      )}
    </section>
  )
}
