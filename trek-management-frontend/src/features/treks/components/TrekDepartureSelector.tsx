import { cn } from '@/lib/utils'
import type { TrekDepartureViewModel } from '../types/trekDetail'
import { Users, Calendar, AlertTriangle } from 'lucide-react'

const STATUS_CONFIG = {
  OPEN:      { label: 'Open',      className: 'text-success-foreground bg-success/15' },
  CANCELLED: { label: 'Cancelled', className: 'text-destructive-foreground bg-destructive/15' },
  COMPLETED: { label: 'Completed', className: 'text-muted-foreground bg-muted' },
} as const

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface TrekDepartureSelectorProps {
  departures: TrekDepartureViewModel[]
  selectedDepartureId: string | null
  onSelect: (departureId: string) => void
}

export function TrekDepartureSelector({
  departures,
  selectedDepartureId,
  onSelect,
}: TrekDepartureSelectorProps) {
  const bookable = departures.filter((d) => d.status === 'OPEN' && !d.isSoldOut)
  const other = departures.filter((d) => d.status !== 'OPEN' || d.isSoldOut)

  return (
    <section id="departures">
      <h2 className="text-2xl font-display font-bold text-foreground mb-4">Upcoming Departures</h2>

      {departures.length === 0 ? (
        <div className="bg-card shadow-sm rounded-2xl p-8 text-center border border-border">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No upcoming departures available.</p>
          <p className="text-muted-foreground/70 text-xs mt-1">
            Check back soon or contact us for custom dates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Bookable departures */}
          {bookable.map((dep) => {
            const isSelected = selectedDepartureId === dep.id
            const isFillingFast = dep.isFillingFast

            return (
              <button
                key={dep.id}
                onClick={() => onSelect(dep.id)}
                className={cn(
                  'w-full text-left rounded-2xl border p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected
                    ? 'border-accent bg-accent/5 ring-1 ring-accent/30 shadow-sm relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-accent'
                    : 'border-border bg-card shadow-sm hover:border-primary/30 hover:bg-muted/40 hover:shadow-md'
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Dates */}
                  <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-[2.5px] flex items-center justify-center shrink-0 transition-colors',
                          isSelected ? 'border-accent' : 'border-muted-foreground/30'
                        )}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                        )}
                      </div>
                      <div>
                        <div className="text-foreground font-bold text-[1.05rem]">
                          {formatDate(dep.startDate)} → {formatDate(dep.endDate)}
                        </div>
                        <div className="text-muted-foreground font-medium text-[0.85rem] mt-1">
                          Deadline: {formatDate(dep.registrationDeadline)}
                      </div>
                    </div>
                  </div>

                  {/* Price + seats */}
                  <div className="flex items-center gap-4 sm:gap-6 pl-7 sm:pl-0">
                    {/* Price */}
                    <div className="text-right">
                      {dep.discountPrice ? (
                        <>
                          <div className="text-accent font-bold text-base">
                            ₹{dep.discountPrice.toLocaleString('en-IN')}
                          </div>
                          <div className="text-muted-foreground text-xs line-through">
                            ₹{dep.price.toLocaleString('en-IN')}
                          </div>
                        </>
                      ) : (
                        <div className="text-accent font-bold text-base">
                          ₹{dep.price.toLocaleString('en-IN')}
                        </div>
                      )}
                      <div className="text-muted-foreground text-xs">per person</div>
                    </div>

                    {/* Seats */}
                    <div className="text-right">
                      <div
                        className={cn(
                          'text-sm font-medium flex items-center gap-1',
                          isFillingFast ? 'text-warning' : 'text-muted-foreground'
                        )}
                      >
                        {isFillingFast && <AlertTriangle className="w-3 h-3" />}
                        <Users className="w-3 h-3" />
                        {dep.availableSeats}/{dep.totalSeats}
                      </div>
                      {isFillingFast && (
                        <div className="text-warning text-xs font-medium">Filling Fast</div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}

          {/* Sold out / cancelled departures (dimmed, non-interactive) */}
          {other.map((dep) => {
            const statusCfg = STATUS_CONFIG[dep.status]
            return (
              <div
                key={dep.id}
                className="w-full text-left rounded-2xl border border-border bg-muted/40 p-5 opacity-60 cursor-not-allowed"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-muted-foreground font-semibold text-sm">
                      {formatDate(dep.startDate)} → {formatDate(dep.endDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-muted-foreground text-sm">
                      ₹{dep.effectivePrice.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full',
                        statusCfg.className
                      )}
                    >
                      {dep.isSoldOut ? 'Sold Out' : statusCfg.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
