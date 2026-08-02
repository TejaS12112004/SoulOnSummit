import type { ReactNode } from 'react'
import { Timer, Users } from 'lucide-react'
import type { TrekResponseDto } from '@/types/api'

interface TrekOverviewProps {
  trek: TrekResponseDto
}

const cardClassName = "bg-card border border-border shadow-sm rounded-2xl p-7 md:p-8"
const statBoxClassName = "bg-muted rounded-xl p-4 flex flex-col gap-2"

function StatCard({ iconNode, label, value }: { iconNode: ReactNode; label: string; value: string }) {
  return (
    <div className={statBoxClassName}>
      <div className="text-muted-foreground">{iconNode}</div>
      <div>
        <p className="text-muted-foreground" style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', fontFamily: 'inherit' }}>
          {label}
        </p>
        <p className="text-foreground" style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit' }}>{value}</p>
      </div>
    </div>
  )
}

export function TrekOverview({ trek }: TrekOverviewProps) {
  const difficultyLabel = trek.difficulty
    ? trek.difficulty.charAt(0).toUpperCase() + trek.difficulty.slice(1).toLowerCase()
    : 'N/A'

  return (
    <section className={cardClassName}>
      <h2 className="text-foreground" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'inherit' }}>
        Overview
      </h2>

      <p className="text-muted-foreground" style={{ lineHeight: 1.7, marginBottom: '24px', fontSize: '0.93rem', fontFamily: 'inherit' }}>
        {trek.description || 'Description coming soon.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <StatCard
          iconNode={<Timer style={{ width: 20, height: 20 }} strokeWidth={1.5} />}
          label="Duration"
          value={`${trek.durationDays} Days`}
        />
        <StatCard
          iconNode={
            <svg viewBox="0 0 24 24" className="fill-foreground" style={{ width: 20, height: 20 }}>
              <path d="M12 2L2 22h20L12 2z" />
            </svg>
          }
          label="Max Altitude"
          value={trek.maxAltitude ? `${trek.maxAltitude.toLocaleString('en-IN')} ft` : 'N/A'}
        />
        <StatCard
          iconNode={<span style={{ fontSize: '1.25rem', lineHeight: 1 }}>🧗</span>}
          label="Difficulty"
          value={difficultyLabel}
        />
        <StatCard
          iconNode={<Users style={{ width: 20, height: 20, color: '#5B21B6' }} strokeWidth={2} />}
          label="Group Size"
          value="Max 12"
        />
      </div>
    </section>
  )
}
