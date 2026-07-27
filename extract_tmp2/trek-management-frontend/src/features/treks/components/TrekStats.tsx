import { Clock, Mountain, MapPin, Route, Compass } from 'lucide-react'
import type { TrekDetailViewModel } from '../types/trekDetail'

interface TrekStatsProps {
  trek: TrekDetailViewModel
}

interface StatItem {
  icon: React.ReactNode
  label: string
  value: string
}

export function TrekStats({ trek }: TrekStatsProps) {
  const stats: StatItem[] = [
    {
      icon: <Clock className="w-5 h-5 text-accent" />,
      label: 'Duration',
      value: `${trek.durationDays} Days`,
    },
    ...(trek.maxAltitude
      ? [
          {
            icon: <Mountain className="w-5 h-5 text-accent" />,
            label: 'Max Altitude',
            value: `${trek.maxAltitude.toLocaleString()} m`,
          },
        ]
      : []),
    {
      icon: <MapPin className="w-5 h-5 text-accent" />,
      label: 'Location',
      value: trek.location,
    },
    ...(trek.distanceKm
      ? [
          {
            icon: <Route className="w-5 h-5 text-accent" />,
            label: 'Distance',
            value: `${trek.distanceKm} km`,
          },
        ]
      : []),
    ...(trek.pickupPoint
      ? [
          {
            icon: <Compass className="w-5 h-5 text-accent" />,
            label: 'Pickup Point',
            value: trek.pickupPoint,
          },
        ]
      : []),
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white shadow-card rounded-2xl p-4 flex flex-col items-center text-center gap-2 border border-white/10"
        >
          {stat.icon}
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
            {stat.label}
          </span>
          <span className="text-white font-semibold text-sm">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}
