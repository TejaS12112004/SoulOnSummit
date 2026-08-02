import { MapPin, Star, Mountain, Clock } from 'lucide-react'
import type { TrekResponseDto } from '@/types/api'

interface TrekDetailHeroProps {
  trek: TrekResponseDto
}

// Fallback landscape image if coverImageUrl is missing/broken
const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80&fit=crop'

export function TrekDetailHero({ trek }: TrekDetailHeroProps) {
  const thumbnails = trek.images?.filter((img) => img.imageUrl).slice(0, 5) ?? []

  const difficultyLabel = trek.difficulty
    ? trek.difficulty.charAt(0).toUpperCase() + trek.difficulty.slice(1).toLowerCase()
    : 'N/A'

  const heroSrc = trek.coverImageUrl || FALLBACK_IMG

  return (
    <div className="w-full flex flex-col">
      {/* ── Hero Image ─────────────────────────────────────────────── */}
      <div
        className="relative w-full flex flex-col justify-end overflow-hidden"
        style={{ height: 'clamp(420px, 60vh, 680px)' }}
      >
        {/* Background */}
        <img
          src={heroSrc}
          alt={trek.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = FALLBACK_IMG
          }}
        />
        {/* Gradient — heavy at bottom, fades to clear at top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,18,26,0.92) 0%, rgba(10,18,26,0.5) 40%, transparent 80%)',
          }}
        />

        {/* Text content pinned to bottom */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-12">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="px-3.5 py-1.5 rounded-full text-[0.72rem] font-extrabold tracking-widest uppercase bg-white text-[#D97706] shadow">
              {difficultyLabel}
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5" />
              {trek.durationDays} Days
            </span>
            {trek.maxAltitude > 0 && (
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.78rem] font-semibold bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                <Mountain className="w-3.5 h-3.5" />
                {trek.maxAltitude.toLocaleString('en-IN')} ft
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="font-bold text-white leading-tight font-display tracking-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            {trek.title}
          </h1>

          {/* Location + Rating */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-pink-400 fill-pink-400 shrink-0" />
              <span className="text-[0.9rem] text-white/80 font-sans">
                {trek.location}
                {trek.state ? `, ${trek.state}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 shrink-0" />
              <span className="text-[0.9rem] text-white/80 font-sans">
                <span className="text-white font-semibold">4.8</span> (876 reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Thumbnail Bar ──────────────────────────────────────────── */}
      <div className="w-full bg-[#163A28] flex justify-center items-center gap-3.5 py-3.5 px-6">
        {thumbnails.length > 0 ? (
          thumbnails.map((img, idx) => (
            <button
              key={img.id ?? idx}
              className={`relative w-[78px] h-[52px] rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                idx === 0
                  ? 'border-[#F59E0B]'
                  : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/40'
              }`}
            >
              <img
                src={img.imageUrl}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            </button>
          ))
        ) : (
          /* Still render the bar even with no thumbnails — just hide the placeholder text */
          <div className="h-[52px] flex items-center">
            <span className="text-white/20 text-xs font-sans">No gallery photos</span>
          </div>
        )}
      </div>
    </div>
  )
}
