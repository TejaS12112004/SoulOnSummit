import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { useTrekDetail } from '../hooks/useTrekDetail'
import { TrekHero } from '../components/TrekHero'
import { TrekStats } from '../components/TrekStats'
import { TrekOverview } from '../components/TrekOverview'
import { TrekGallery } from '../components/TrekGallery'
import { TrekItinerary } from '../components/TrekItinerary'
import { TrekInclusions } from '../components/TrekInclusions'
import { TrekThingsToCarry } from '../components/TrekThingsToCarry'
import { TrekDepartureSelector } from '../components/TrekDepartureSelector'
import { TrekBookingCard } from '../components/TrekBookingCard'
import { TrekFAQ } from '../components/TrekFAQ'
import { TrekDetailSkeleton } from '../components/TrekDetailSkeleton'
import type { TrekDepartureViewModel } from '../types/trekDetail'
import { ROUTES } from '@/constants/routes'

export default function TrekDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: trek, isLoading, isError, refetch } = useTrekDetail(id)

  /**
   * selectedDeparture is the single piece of UI state this page owns.
   * It is passed to TrekBookingCard which uses it to construct the
   * /bookings/new navigation with departureId in router state.
   */
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null)

  if (isLoading) return <TrekDetailSkeleton />

  if (isError || !trek) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">Trek not found</h2>
          <p className="text-muted-foreground text-sm mb-6">
            This trek may have been removed or is temporarily unavailable.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              to={ROUTES.TREKS}
              className="inline-flex items-center px-5 py-2.5 rounded-xl border border-border text-muted-foreground font-semibold text-sm hover:bg-muted hover:text-foreground transition-colors"
            >
              All Treks
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const selectedDeparture: TrekDepartureViewModel | null =
    trek.departures.find((d) => d.id === selectedDepartureId) ?? null

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <TrekHero trek={trek} />

      {/* Mobile Booking Card — shown before main content on small screens */}
      <div className="lg:hidden max-w-7xl mx-auto px-6 pt-6">
        <TrekBookingCard trek={trek} selectedDeparture={selectedDeparture} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left column — content */}
          <div className="flex-1 min-w-0 space-y-20">
            <TrekStats trek={trek} />
            <TrekOverview trek={trek} />
            {trek.images.length > 0 && <TrekGallery images={trek.images} />}
            {trek.itineraryDays.length > 0 && <TrekItinerary days={trek.itineraryDays} />}
            {(trek.inclusions.length > 0 || trek.exclusions.length > 0) && (
              <TrekInclusions inclusions={trek.inclusions} exclusions={trek.exclusions} />
            )}
            {(trek.packingItems.length > 0 || trek.thingsToCarry) && (
              <TrekThingsToCarry items={trek.packingItems} rawText={trek.thingsToCarry} />
            )}

            {/* KEY Sprint 5.2 section: departure selection */}
            <TrekDepartureSelector
              departures={trek.departures}
              selectedDepartureId={selectedDepartureId}
              onSelect={setSelectedDepartureId}
            />

            {trek.faqs.length > 0 && <TrekFAQ faqs={trek.faqs} />}

            {trek.cancellationPolicy && (
              <section>
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Cancellation Policy
                </h2>
                <div className="bg-card shadow-sm rounded-2xl p-5 border border-border">
                  {trek.cancellationPolicy.split('\n').map((line, i) =>
                    line.trim() ? (
                      <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-2">
                        {line}
                      </p>
                    ) : null
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right column — sticky booking card (desktop only) */}
          <div className="hidden lg:block lg:w-[360px] shrink-0">
            <TrekBookingCard trek={trek} selectedDeparture={selectedDeparture} />
          </div>
        </div>
      </div>
    </div>
  )
}
