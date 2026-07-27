import type { TrekDetailViewModel } from '../types/trekDetail'
import { MapPin, Clock, Mountain, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80'

const DIFFICULTY_CONFIG = {
  EASY:      { label: 'Easy',      className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  MODERATE:  { label: 'Moderate',  className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  DIFFICULT: { label: 'Difficult', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  EXTREME:   { label: 'Extreme',   className: 'bg-red-500/20 text-red-400 border-red-500/30' },
} as const

interface TrekHeroProps {
  trek: TrekDetailViewModel
}

export function TrekHero({ trek }: TrekHeroProps) {
  const difficulty = DIFFICULTY_CONFIG[trek.difficulty] ?? DIFFICULTY_CONFIG.MODERATE

  return (
    <div className="relative h-[70vh] min-h-[480px] max-h-[680px] overflow-hidden">
      {/* Cover Image */}
      <img
        src={trek.coverImageUrl ?? PLACEHOLDER_IMAGE}
        alt={trek.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-[#0D0B09]/50 to-transparent" />

      {/* Back navigation */}
      <div className="absolute top-6 left-6">
        <Link
          to={ROUTES.TREKS}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Treks
        </Link>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <span
            className={`inline-block text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider mb-4 ${difficulty.className}`}
          >
            {difficulty.label}
          </span>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-3 leading-tight">
            {trek.title}
          </h1>

          {trek.subtitle && (
            <p className="text-white/70 text-lg mb-5 max-w-2xl">{trek.subtitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-white/80 text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-accent" />
              {trek.location}, {trek.state}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              {trek.durationDays} Days
            </span>
            {trek.maxAltitude && (
              <span className="flex items-center gap-1.5">
                <Mountain className="w-4 h-4 text-accent" />
                {trek.maxAltitude.toLocaleString()} m
              </span>
            )}
            {trek.lowestPrice && (
              <span className="text-accent font-bold text-base">
                From ₹{trek.lowestPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
