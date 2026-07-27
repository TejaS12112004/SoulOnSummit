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
    <div className="bg-card shadow-card rounded-card border border-border p-6 sticky top-6 text-card-foreground">
      {/* Price header */}
      <div className="mb-5">
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
            <div className="text-muted-foreground text-xs mb-1">Starting from</div>
            <div className="text-accent font-bold text-3xl font-display">
              ₹{trek.lowestPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-muted-foreground text-xs mt-1">per person</div>
          </>
        ) : (
          <div className="text-muted-foreground text-sm">Price on request</div>
        )}
      </div>

      {/* Selected departure summary */}
      {selectedDeparture ? (
        <div className="bg-muted rounded-card p-4 mb-5 space-y-2.5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="w-4 h-4 text-accent shrink-0" />
            <span>
              {formatDate(selectedDeparture.startDate)} → {formatDate(selectedDeparture.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="w-4 h-4 text-accent shrink-0" />
            <span>{selectedDeparture.availableSeats} seats available</span>
            {selectedDeparture.isFillingFast && (
              <span className="text-warning text-xs font-semibold">Filling Fast!</span>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-muted rounded-card p-4 mb-5 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-muted-foreground/60 shrink-0" />
          <p className="text-muted-foreground text-sm">Select a departure date to continue</p>
        </div>
      )}

      {/* Book Now CTA */}
      {hasBookableDepartures ? (
        <Button
          onClick={handleBookNow}
          disabled={!selectedDeparture}
          className="w-full py-3.5 rounded-btn font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-accent-foreground"
        >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          disabled
          variant="secondary"
          className="w-full py-3.5 rounded-btn font-semibold text-sm cursor-not-allowed"
        >
          No Departures Available
        </Button>
      )}

      {/* Trek duration reminder */}
      <div className="mt-4 pt-4 border-t border-border text-center text-xs text-muted-foreground">
        {trek.durationDays} days · {trek.difficulty} · {trek.location}
      </div>
    </div>
  )
}
