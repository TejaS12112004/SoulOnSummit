import { useNavigate } from 'react-router-dom'
import { toBookingNew } from '@/constants/routes'
import type { TrekDetailViewModel, TrekDepartureViewModel } from '../types/trekDetail'
import { Calendar, Users, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface TrekBookingCardProps {
  trek: TrekDetailViewModel
  selectedDeparture: TrekDepartureViewModel | null
}

export function TrekBookingCard({ trek, selectedDeparture }: TrekBookingCardProps) {
  const navigate = useNavigate()

  const handleBookNow = () => {
    if (!selectedDeparture) return
    // Navigate to booking page — pass departureId and trekId via router state.
    // TD-001: trekId in state is temporary. Remove when backend adds GET /api/v1/departures/{id}.
    navigate(toBookingNew(), {
      state: { departureId: selectedDeparture.id, trekId: trek.id },
    })
  }

  const hasBookableDepartures = trek.departures.some(
    (d) => d.status === 'OPEN' && !d.isSoldOut
  )

  return (
    <div className="bg-card shadow-2xl rounded-2xl border border-border/50 p-8 sticky top-24 text-card-foreground">
      {/* Price header */}
      <div className="mb-7">
        {selectedDeparture ? (
          <>
            {selectedDeparture.discountPrice ? (
              <div>
                <div className="text-accent font-bold text-3xl font-display">
                  ₹{selectedDeparture.discountPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-muted-foreground text-sm line-through mt-0.5">
                  ₹{selectedDeparture.price.toLocaleString('en-IN')}
                </div>
              </div>
            ) : (
              <div className="text-accent font-bold text-3xl font-display">
                ₹{selectedDeparture.price.toLocaleString('en-IN')}
              </div>
            )}
            <div className="text-muted-foreground text-xs mt-1">per person</div>
          </>
        ) : trek.lowestPrice ? (
          <>
            <div className="text-muted-foreground text-[0.8rem] uppercase tracking-wider font-semibold mb-1.5">Starting from</div>
            <div className="text-accent font-bold text-4xl lg:text-[2.6rem] leading-none tracking-tight font-display">
              ₹{trek.lowestPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-muted-foreground text-sm mt-1.5">per person</div>
          </>
        ) : (
          <div className="text-muted-foreground text-sm">Price on request</div>
        )}
      </div>

      {/* Selected departure summary */}
      {selectedDeparture ? (
        <div className="bg-muted/40 rounded-xl p-5 mb-6 space-y-3 border border-border/40">
          <div className="flex items-center gap-3 text-foreground/80 text-[0.95rem] font-medium">
            <Calendar className="w-5 h-5 text-accent shrink-0" />
            <span>
              {formatDate(selectedDeparture.startDate)} → {formatDate(selectedDeparture.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-foreground/80 text-[0.95rem] font-medium">
            <Users className="w-5 h-5 text-accent shrink-0" />
            <span>{selectedDeparture.availableSeats} seats available</span>
            {selectedDeparture.isFillingFast && (
              <span className="text-destructive bg-destructive/10 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ml-auto">Filling Fast</span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-muted/40 rounded-xl p-5 mb-6 flex items-center gap-3 border border-border/40">
          <AlertCircle className="w-5 h-5 text-muted-foreground/50 shrink-0" />
          <p className="text-muted-foreground font-medium text-[0.95rem]">Select a departure date to continue</p>
        </div>
      )}

      {/* Book Now CTA */}
      {hasBookableDepartures ? (
        <Button
          onClick={handleBookNow}
          disabled={!selectedDeparture}
          className="w-full h-14 rounded-xl font-bold text-[1.1rem] transition-transform duration-200 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground active:scale-[0.98] shadow-lg shadow-accent/20"
        >
          Book Now
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      ) : (
        <Button
          disabled
          variant="secondary"
          className="w-full h-14 rounded-xl font-bold text-base cursor-not-allowed opacity-70"
        >
          No Departures Available
        </Button>
      )}

      {/* Trek duration reminder */}
      <div className="mt-5 pt-5 border-t border-border/40 text-center text-[11px] text-muted-foreground/60 uppercase tracking-widest font-semibold">
        {trek.durationDays} days · {trek.difficulty} · {trek.location}
      </div>
    </div>
  )
}
