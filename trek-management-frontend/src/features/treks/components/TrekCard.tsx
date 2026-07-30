import { useState } from 'react'
import { MapPin, Clock, Mountain, Star, Image as ImageIcon } from 'lucide-react'

interface TrekCardProps {
  id: number;
  title: string;
  location: string;
  duration: string;
  altitude: string;
  difficulty: 'EASY' | 'MODERATE' | 'HARD' | 'CHALLENGING';
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  nextDate: string;
  spotsLeft?: number;
}

const difficultyColors = {
  EASY: 'bg-white/20 text-white border border-white/40',
  MODERATE: 'bg-white/20 text-white border border-[#F59E0B]/50',
  HARD: 'bg-black/30 text-[#FCA5A5] border border-red-400/40',
  CHALLENGING: 'bg-black/40 text-[#C4B5FD] border border-purple-400/40',
}

export function TrekCard({
  title, location, duration, altitude, difficulty, price, originalPrice, rating, reviews, image, nextDate, spotsLeft
}: TrekCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="flex flex-col bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1.5">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {!imageFailed ? (
          <img 
            src={image} 
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
            className={`rounded-full text-[11px] font-bold tracking-wider uppercase ${difficultyColors[difficulty]} shadow-sm backdrop-blur-md`}
            style={{ padding: '6px 14px' }}
          >
            {difficulty}
          </span>
        </div>

        {/* Top Right Badge (Urgency) */}
        {spotsLeft && spotsLeft <= 5 && (
          <div className="absolute top-4 right-4" style={{ top: '16px', right: '16px' }}>
            <span 
              className="rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#DC2626] text-white shadow-sm"
              style={{ padding: '6px 14px' }}
            >
              Only {spotsLeft} left!
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1" style={{ padding: '24px' }}>
        
        {/* Title */}
        <h3 
          className="font-display text-[18px] font-bold text-[#1C2B3A] leading-tight group-hover:text-[#1F4D3A] transition-colors line-clamp-1"
          style={{ marginBottom: '12px' }}
        >
          {title}
        </h3>
        
        {/* Location */}
        <div className="flex items-center text-[#64748B]" style={{ marginBottom: '20px', gap: '8px' }}>
          <MapPin className="w-[16px] h-[16px] text-[#F59E0B]" />
          <span className="text-[14px] font-medium">{location}</span>
        </div>
        
        {/* Quick Details Row */}
        <div className="flex items-center text-[#64748B]" style={{ marginBottom: '20px', gap: '20px' }}>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Clock className="w-[16px] h-[16px]" />
            <span className="text-[13px] font-medium">{duration}</span>
          </div>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Mountain className="w-[16px] h-[16px]" />
            <span className="text-[13px] font-medium">{altitude}</span>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center" style={{ marginBottom: '16px', gap: '8px' }}>
          <div className="flex items-center" style={{ gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-[14px] h-[14px] ${star <= Math.round(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-gray-200 text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[12px] font-medium text-[#64748B]">
            <span className="text-[#334155] font-bold">{rating}</span> ({reviews})
          </span>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" style={{ marginBottom: '20px', marginTop: '8px' }} />

        {/* Footer Pricing & Date */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[12px] text-[#94A3B8] line-through font-medium leading-none" style={{ marginBottom: '4px' }}>
                {originalPrice}
              </span>
            )}
            <div className="flex items-baseline" style={{ gap: '6px' }}>
              <span className="text-[26px] font-extrabold text-[#1F4D3A] leading-none tracking-tight">{price}</span>
              <span className="text-[13px] text-[#64748B] font-medium">/person</span>
            </div>
          </div>
          
          <div className="text-[13px] font-medium text-[#64748B]">
            Next: {nextDate}
          </div>
        </div>

      </div>
    </div>
  )
}
