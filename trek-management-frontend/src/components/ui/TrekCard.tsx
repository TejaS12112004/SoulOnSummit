import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, Users } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { HTMLMotionProps } from "framer-motion"
import type { TrekDifficulty } from "@/types/difficulty"

export interface Trek {
  id: string
  title: string
  coverImage?: string
  difficulty: TrekDifficulty
  durationDays: number
  location: string
  state: string
  startingPrice: number
  departureDate?: string
  seatsRemaining?: number
  isFeatured?: boolean
}

export interface TrekCardProps extends HTMLMotionProps<"div"> {
  trek: Trek
  onViewDetails?: (id: string) => void
  onBookNow?: (id: string) => void
}

const difficultyColors: Record<TrekDifficulty, string> = {
  EASY: "bg-success/15 text-success-foreground border-transparent",
  MODERATE: "bg-info/15 text-info-foreground border-transparent",
  DIFFICULT: "bg-warning/15 text-warning-foreground border-transparent",
  EXTREME: "bg-destructive/15 text-destructive-foreground border-transparent",
}

const difficultyLabels: Record<TrekDifficulty, string> = {
  EASY: "Easy",
  MODERATE: "Moderate",
  DIFFICULT: "Difficult",
  EXTREME: "Extreme",
}

export function TrekCard({
  trek,
  onViewDetails,
  onBookNow,
  className,
  ...props
}: TrekCardProps) {
  return (
    <motion.div
      className={cn("h-full", className)}
      {...props}
    >
      <Card className="h-full flex flex-col overflow-hidden rounded-2xl border-border/40 bg-card text-card-foreground shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-hover cursor-pointer group">
        {/* Cover Image Section */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {trek.coverImage ? (
            <img
              src={trek.coverImage}
              alt={`Cover for ${trek.title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">No Image Available</span>
            </div>
          )}
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {trek.isFeatured && (
              <Badge variant="default" className="bg-accent text-accent-foreground shadow-sm rounded-full px-3">
                Featured
              </Badge>
            )}
            <div className="flex-grow" />
            <Badge className={cn("rounded-full font-semibold shadow-sm", difficultyColors[trek.difficulty])}>
              {difficultyLabels[trek.difficulty]}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-6 pb-2">
          <h3 className="font-display text-2xl font-bold leading-tight line-clamp-2" title={trek.title}>
            {trek.title}
          </h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground opacity-80">
            <MapPin className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{trek.location}</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-3 pb-6 flex-grow flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground/80">
            <div className="flex items-center">
              <Clock className="mr-1.5 h-3.5 w-3.5 shrink-0" />
              <span>{trek.durationDays} Days</span>
            </div>
            {trek.departureDate && (
              <div className="flex items-center">
                <Calendar className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{trek.departureDate}</span>
              </div>
            )}
            {trek.seatsRemaining !== undefined && (
              <div className="flex items-center">
                <Users className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  {trek.seatsRemaining} {trek.seatsRemaining === 1 ? "seat" : "seats"} left
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-t border-border/40 mt-auto bg-muted/5">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Starting from</span>
            <span className="text-2xl font-bold text-foreground">
              ${trek.startingPrice.toLocaleString()}
            </span>
          </div>
          
          <div className="flex flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => onViewDetails?.(trek.id)}
            >
              Details
            </Button>
            <Button
              variant="default"
              className="flex-1 sm:flex-none"
              onClick={() => onBookNow?.(trek.id)}
            >
              Book Now
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
