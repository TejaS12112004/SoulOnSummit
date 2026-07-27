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
                  className="w-full flex items-center justify-between px-7 py-6 text-left focus-visible:outline-none focus-visible:bg-muted/20 focus-visible:ring-2 focus-visible:ring-ring transition-colors hover:bg-muted/20"
                  onClick={() => setOpenDay(isOpen ? null : day.id)}
                >
                  <div className="text-left pr-4">
                    <div className="text-foreground font-bold text-[1.15rem]">{day.title}</div>
                    {day.altitude && (
                      <div className="text-muted-foreground font-medium text-[0.85rem] mt-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                        {day.altitude.toLocaleString()} m altitude
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 bg-muted/50 p-2 rounded-full group-hover:bg-muted transition-colors">
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
                      <div className="px-7 pb-7 border-t border-border/30 pt-6">
                        {day.description && (
                          <p className="text-muted-foreground text-[0.95rem] leading-relaxed mb-6 whitespace-pre-line">{day.description}</p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-[0.85rem] text-muted-foreground/80 bg-muted/30 p-6 rounded-2xl border border-border/40">
                          {day.stay && (
                            <div className="flex flex-col gap-1.5">
                              <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70"><Tent className="w-3.5 h-3.5" /> Stay</span>
                              <span className="text-foreground/90 font-medium">{day.stay}</span>
                            </div>
                          )}
                          {day.meals && (
                            <div className="flex flex-col gap-1.5">
                              <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70"><Utensils className="w-3.5 h-3.5" /> Meals</span>
                              <span className="text-foreground/90 font-medium">{day.meals}</span>
                            </div>
                          )}
                          {day.distanceKm && (
                            <div className="flex flex-col gap-1.5">
                              <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70"><MapPin className="w-3.5 h-3.5" /> Distance</span>
                              <span className="text-foreground/90 font-medium">{day.distanceKm} km</span>
                            </div>
                          )}
                          {day.durationHours && (
                            <div className="flex flex-col gap-1.5">
                              <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground/70"><Clock className="w-3.5 h-3.5" /> Duration</span>
                              <span className="text-foreground/90 font-medium">{day.durationHours} hrs</span>
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
