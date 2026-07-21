import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, Users } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HTMLMotionProps } from "framer-motion"

export interface Trek {
  id: string
  title: string
  coverImage?: string
  difficulty: "Easy" | "Moderate" | "Hard" | "Extreme"
  durationDays: number
  location: string
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

const difficultyColors = {
  Easy: "bg-green-100 text-green-800 border-transparent",
  Moderate: "bg-blue-100 text-blue-800 border-transparent",
  Hard: "bg-amber-100 text-amber-800 border-transparent",
  Extreme: "bg-red-100 text-red-800 border-transparent",
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("h-full", className)}
      {...props}
    >
      <Card className="h-full flex flex-col overflow-hidden rounded-[var(--radius-card)] border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
        {/* Cover Image Section */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {trek.coverImage ? (
            <img
              src={trek.coverImage}
              alt={`Cover for ${trek.title}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
            <Badge className={cn("rounded-[var(--radius-pill)] font-semibold shadow-sm", difficultyColors[trek.difficulty])}>
              {trek.difficulty}
            </Badge>
          </div>
        </div>

        <CardHeader className="p-5 pb-2">
          <h3 className="font-display text-xl font-bold leading-tight line-clamp-2" title={trek.title}>
            {trek.title}
          </h3>
          <div className="mt-2 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{trek.location}</span>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-3 pb-4 flex-grow flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 shrink-0 opacity-70" />
              <span>{trek.durationDays} Days</span>
            </div>
            {trek.departureDate && (
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                <span className="truncate">{trek.departureDate}</span>
              </div>
            )}
            {trek.seatsRemaining !== undefined && (
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                <span>
                  {trek.seatsRemaining} {trek.seatsRemaining === 1 ? "seat" : "seats"} left
                </span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border/40 mt-auto bg-muted/10">
          <div className="flex flex-col mt-3 sm:mt-0">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Starting from</span>
            <span className="text-lg font-bold text-foreground">
              ${trek.startingPrice.toLocaleString()}
            </span>
          </div>
          
          <div className="flex flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none rounded-full"
              onClick={() => onViewDetails?.(trek.id)}
            >
              Details
            </Button>
            <Button
              variant="default"
              className="flex-1 sm:flex-none rounded-full"
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
