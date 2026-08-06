import { useState } from 'react'
import { MapPin, Clock, Mountain, Star, Image as ImageIcon, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toTrekDetail } from '@/constants/routes'
import { useWishlist } from '@/hooks/useWishlist'
import type { TrekSummaryResponse } from '@/types/api'

interface TrekCardProps {
  trek: TrekSummaryResponse;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

const difficultyColors = {
  EASY: 'bg-white/20 text-white border border-white/40',
  MODERATE: 'bg-white/20 text-white border border-[#F59E0B]/50',
  HARD: 'bg-black/30 text-[#FCA5A5] border border-red-400/40',
  CHALLENGING: 'bg-black/40 text-[#C4B5FD] border border-purple-400/40',
}

export function TrekCard({ trek }: TrekCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const { title, location, durationDays, maxAltitude, difficulty, lowestPrice, originalPrice, rating, reviewCount, coverImageUrl, nextDepartureDate, nextDepartureAvailableSeats } = trek;

  return (
    <Link 
      to={toTrekDetail(trek.id)}
      className="flex flex-col bg-card rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border group cursor-pointer transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1.5"
    >
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageFailed ? (
          <img 
            src={coverImageUrl || ''} 
            alt={title} 
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-gray-300" />
        )}
        
        {/* Gradient Overlay for better badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/30 opacity-60" />
        
        {/* Top Left Badge (Difficulty) */}
        <div className="absolute top-4 left-4" style={{ top: '16px', left: '16px' }}>
          <span 
            className={`rounded-full text-[11px] font-bold tracking-wider uppercase ${difficultyColors[difficulty as keyof typeof difficultyColors] || difficultyColors.EASY} shadow-sm backdrop-blur-md`}
            style={{ padding: '6px 14px' }}
          >
            {difficulty}
          </span>
        </div>

        {/* Top Right Badge (Urgency) */}
        {nextDepartureAvailableSeats !== null && nextDepartureAvailableSeats <= 5 && (
          <div className="absolute top-4 right-4" style={{ top: '16px', right: '16px' }}>
            <span 
              className="rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#DC2626] text-white shadow-sm"
              style={{ padding: '6px 14px' }}
            >
              Only {nextDepartureAvailableSeats} left!
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1" style={{ padding: '24px' }}>
        
        {/* Title & Wishlist */}
        <div className="flex items-start justify-between" style={{ marginBottom: '12px', gap: '12px' }}>
          <h3 
            className="font-display text-[18px] font-bold text-card-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1"
          >
            {title}
          </h3>
          <button 
            type="button"
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation();
              toggleWishlist(trek.id); 
            }}
            className="transition-colors group/heart"
            style={{ padding: '2px', flexShrink: 0 }}
            aria-label={isInWishlist(trek.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-[22px] h-[22px] transition-colors ${isInWishlist(trek.id) ? 'fill-[#EF4444] text-[#EF4444]' : 'text-gray-300 group-hover/heart:text-[#EF4444]'}`} />
          </button>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-muted-foreground" style={{ marginBottom: '20px', gap: '8px' }}>
          <MapPin className="w-[16px] h-[16px] text-[#F59E0B]" />
          <span className="text-[14px] font-medium">{location}</span>
        </div>
        
        {/* Quick Details Row */}
        <div className="flex items-center text-muted-foreground" style={{ marginBottom: '20px', gap: '20px' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Clock className="w-[16px] h-[16px]" />
            <span className="text-[13px] font-medium">{durationDays} Days</span>
          </div>
          {maxAltitude !== null && maxAltitude > 0 && (
            <div className="flex items-center" style={{ gap: '8px' }}>
              <Mountain className="w-[16px] h-[16px]" />
              <span className="text-[13px] font-medium">{maxAltitude.toLocaleString()} ft</span>
            </div>
          )}
        </div>

        {/* Ratings */}
        {rating != null && (
          <div className="flex items-center" style={{ marginBottom: '16px', gap: '8px' }}>
            <div className="flex items-center" style={{ gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-[14px] h-[14px] ${star <= Math.round(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-gray-200 text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-[12px] font-medium text-muted-foreground">
              <span className="text-foreground font-bold">{rating}</span> 
              {reviewCount != null && ` (${reviewCount})`}
            </span>
          </div>
        )}

        {/* Divider */}
        <hr className="border-border" style={{ marginBottom: '20px', marginTop: '8px' }} />

        {/* Footer Pricing & Date */}
        <div className="mt-auto flex flex-col justify-end gap-1">
          {nextDepartureDate && (
            <div className="text-[12px] font-semibold text-[#10B981] truncate">
              Next Departure: {new Date(nextDepartureDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {originalPrice != null && (
                <span className="text-[12px] text-muted-foreground line-through font-medium leading-none" style={{ marginBottom: '4px' }}>
                  {formatCurrency(originalPrice)}
                </span>
              )}
              <div className="flex items-baseline" style={{ gap: '6px' }}>
                <span className="text-[24px] font-extrabold text-primary leading-none tracking-tight">
                  {lowestPrice != null ? formatCurrency(lowestPrice) : 'TBA'}
                </span>
                <span className="text-[13px] text-muted-foreground font-medium">/person</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}
