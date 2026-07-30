import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, Mountain, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/formatters/currency"
import { formatDate } from "@/utils/formatters/formatDate"
import type { HTMLMotionProps } from "framer-motion"
import type { TrekDifficulty } from "@/types/difficulty"

export interface Trek {
  id: string
  title: string
  coverImage?: string
  difficulty: TrekDifficulty
  durationDays: number
  maxAltitude?: number
  location: string
  state: string
  startingPrice: number
  originalPrice?: number
  departureDate?: string
  seatsRemaining?: number
  isFeatured?: boolean
  rating?: number
  reviewCount?: number
}

export interface TrekCardProps extends HTMLMotionProps<"div"> {
  trek: Trek
  onViewDetails?: (id: string) => void
  onBookNow?: (id: string) => void
}

const difficultyColors: Record<TrekDifficulty, string> = {
  EASY:      "bg-[#D1FAE5] text-[#065F46]",
  MODERATE:  "bg-[#FEF3C7] text-[#92400E]",
  DIFFICULT: "bg-[#FFE4E6] text-[#BE123C]",
  EXTREME:   "bg-[#F3E8FF] text-[#6B21A8]",
}

const difficultyLabels: Record<TrekDifficulty, string> = {
  EASY:      "EASY",
  MODERATE:  "MODERATE",
  DIFFICULT: "HARD",
  EXTREME:   "CHALLENGING",
}

export function TrekCard({
  trek,
  onViewDetails,
  className,
  ...props
}: TrekCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = trek.coverImage && !imageFailed
  const displayRating = trek.rating ?? 4.8
  const displayReviews = trek.reviewCount ?? 876
  const displayAltitude = trek.maxAltitude ?? 14100

  return (
    <motion.div
      className={cn("h-full cursor-pointer", className)}
      onClick={() => onViewDetails?.(trek.id)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      <div className="h-full min-h-[460px] flex flex-col overflow-hidden rounded-[20px] bg-white border border-[#F3F0EA] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 group">

        {/* ── Cover Image ── */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {showImage ? (
            <img
              src={trek.coverImage}
              alt={`Cover for ${trek.title}`}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border border-gray-100">
                <Mountain className="h-8 w-8 text-gray-300" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                Soul On Summit
              </span>
            </div>
          )}

          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className={cn(
              "rounded-full font-bold px-3 py-1 text-[10px] tracking-wider uppercase shadow-sm",
              difficultyColors[trek.difficulty]
            )}>
              {difficultyLabels[trek.difficulty]}
            </div>
          </div>
          
          {/* Low Seats Badge */}
          {trek.seatsRemaining !== undefined && trek.seatsRemaining <= 5 && (
            <div className="absolute top-4 right-4 z-10">
              <div className="rounded-full font-bold px-3 py-1 text-[10px] tracking-wider uppercase shadow-sm bg-[#DC2626] text-white">
                Only {trek.seatsRemaining} left!
              </div>
            </div>
          )}
        </div>

        {/* ── Card Body ── */}
        <div className="flex flex-col flex-grow px-5 pt-5 pb-0">
          {/* Title */}
          <h3
            className="font-bold text-[18px] leading-[1.3] text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1F4D3A] transition-colors font-display"
            title={trek.title}
          >
            {trek.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-[13px] text-gray-500 mb-4">
            <MapPin className="mr-2 h-4 w-4 shrink-0 text-[#EC4899] fill-[#EC4899]/10" />
            <span className="truncate">
              {trek.location}{trek.state ? `, ${trek.state}` : ""}
            </span>
          </div>

          {/* Duration + Altitude */}
          <div className="flex items-center gap-5 text-[13px] text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-[15px] w-[15px] shrink-0 text-gray-400" />
              <span>{trek.durationDays} Days</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mountain className="h-[15px] w-[15px] shrink-0 text-gray-400" />
              <span>{displayAltitude.toLocaleString()} ft</span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.round(displayRating)
                      ? "fill-[#F59E0B] text-[#F59E0B]"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-[13px] font-medium text-gray-700">
              {displayRating.toFixed(1)}{' '}
              <span className="font-normal text-gray-400">({displayReviews})</span>
            </span>
          </div>

          {/* Spacer pushes footer to bottom */}
          <div className="flex-grow" />
        </div>

        {/* ── Price Section ── */}
        <div className="mx-5 mb-5 pt-4 border-t border-gray-100 flex flex-col">
          {/* Strikethrough original price */}
          <div className="h-5 flex items-end">
            {trek.originalPrice != null && trek.originalPrice > trek.startingPrice && (
              <span className="text-[12px] text-gray-400 line-through">
                ₹{trek.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Price (left) + Next departure (right) */}
          <div className="flex items-end justify-between gap-4 mt-0.5">
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-[22px] font-bold text-[#1F4D3A] tracking-tight leading-none">
                {formatCurrency(trek.startingPrice).replace(".00", "")}
              </span>
              <span className="text-[13px] text-gray-500 font-medium shrink-0 pb-0.5">/person</span>
            </div>
            <div className="text-[12px] text-gray-400 font-medium whitespace-nowrap shrink-0 pb-0.5 text-right">
              Next: {trek.departureDate ? formatDate(trek.departureDate) : 'Jun 20, 2025'}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
