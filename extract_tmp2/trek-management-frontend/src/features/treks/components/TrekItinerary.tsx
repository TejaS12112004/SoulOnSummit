import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Tent, Utensils, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import type { TrekItineraryDayViewModel } from '../types/trekDetail'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=60'

interface TrekItineraryProps {
  days: TrekItineraryDayViewModel[]
}

export function TrekItinerary({ days }: TrekItineraryProps) {
  const [openDay, setOpenDay] = useState<string | null>(days[0]?.id ?? null)

  if (days.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-foreground mb-8">Day-wise Itinerary</h2>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border/0 before:via-border/30 before:to-border/0">
        {days.map((day) => {
          const isOpen = openDay === day.id
          return (
            <div key={day.id} className="relative flex items-start gap-4 md:gap-8 group">
              {/* Timeline Node (Mobile/Desktop) */}
              <div className="absolute left-0 top-0 md:static md:w-1/2 md:flex md:justify-end md:mt-2 z-10 shrink-0">
                <div className={cn("w-12 h-12 rounded-full border-[3px] flex items-center justify-center shrink-0 font-bold shadow-sm transition-all duration-[280ms] bg-card z-10", isOpen ? "border-accent/40 text-accent shadow-accent/10" : "border-border/40 text-muted-foreground/80 group-hover:border-foreground/20 group-hover:shadow-md")}>
                  {day.dayNumber}
                </div>
              </div>

              {/* Content Card */}
              <Card
                className="w-full ml-16 md:ml-0 md:w-1/2 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left focus-visible:outline-none focus-visible:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setOpenDay(isOpen ? null : day.id)}
                >
                  <div className="text-left pr-4">
                    <div className="text-foreground font-semibold text-lg">{day.title}</div>
                    {day.altitude && (
                      <div className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                        {day.altitude.toLocaleString()} m altitude
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-muted-foreground transition-transform duration-[280ms] ease-out',
                        isOpen && 'rotate-180 text-foreground'
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-border/50 pt-5">
                        {day.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">{day.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-6 text-[13px] text-muted-foreground/80 bg-muted/20 p-5 rounded-2xl">
                          {day.stay && (
                            <div className="flex items-center gap-2">
                              <Tent className="w-4 h-4 text-muted-foreground/60" /> <span className="text-foreground/80 font-medium">{day.stay}</span>
                            </div>
                          )}
                          {day.meals && (
                            <div className="flex items-center gap-2">
                              <Utensils className="w-4 h-4 text-muted-foreground/60" /> <span className="text-foreground/80 font-medium">{day.meals}</span>
                            </div>
                          )}
                          {day.distanceKm && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground/60" /> <span className="text-foreground/80 font-medium">{day.distanceKm} km</span>
                            </div>
                          )}
                          {day.durationHours && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground/60" /> <span className="text-foreground/80 font-medium">{day.durationHours}h</span>
                            </div>
                          )}
                        </div>

                        {day.imageUrl && (
                          <div className="mt-8 rounded-2xl overflow-hidden h-48 md:h-64 shadow-sm border border-border/40">
                            <img
                              src={day.imageUrl}
                              alt={day.title}
                              className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                              onError={(e) => {
                                ;(e.currentTarget as HTMLImageElement).src = PLACEHOLDER
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          )
        })}
      </div>
    </section>
  )
}
