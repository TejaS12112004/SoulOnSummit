import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTrekDetail } from '@/hooks/useTrekDetail'
import { QueryErrorState } from '@/components/ui/QueryErrorState'

import { TrekDetailHero } from '../components/TrekDetail/TrekDetailHero'
import { TrekOverview } from '../components/TrekDetail/TrekOverview'
import { TrekHighlights } from '../components/TrekDetail/TrekHighlights'
import { TrekItinerary } from '../components/TrekDetail/TrekItinerary'
import { TrekInclusionsExclusions } from '../components/TrekDetail/TrekInclusionsExclusions'
import { TrekThingsToCarry } from '../components/TrekDetail/TrekThingsToCarry'
import { TrekAvailableBatches } from '../components/TrekDetail/TrekAvailableBatches'
import { TrekFAQ } from '../components/TrekDetail/TrekFAQ'
import { TrekSimilar } from '../components/TrekDetail/TrekSimilar'
import { BookingSidebar } from '../components/TrekDetail/BookingSidebar'

export default function TrekDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: trek, isLoading, isError, error, refetch } = useTrekDetail(id ?? '')
  const [userSelectedBatchId, setUserSelectedBatchId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground font-sans text-sm animate-pulse">Loading trek…</div>
      </div>
    )
  }

  if (isError || !trek) {
    return (
      <div className="min-h-[60vh] px-4 md:px-8 py-20 bg-background">
        <div className="max-w-7xl mx-auto">
          <QueryErrorState error={error} onRetry={refetch} />
        </div>
      </div>
    )
  }

  const sortedDepartures = trek.departures ? [...trek.departures].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  ) : [];

  const defaultBatchId = sortedDepartures.length > 0 ? sortedDepartures[0].id : null;
  const selectedBatchId = userSelectedBatchId ?? defaultBatchId;
  const selectedBatch = trek.departures?.find((d) => d.id === selectedBatchId) ?? null

  return (
    <div className="bg-background min-h-screen">
      {/* Hero — full bleed */}
      <TrekDetailHero trek={trek} />

      {/* Page body */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-10 pb-16 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-7 items-start">

          {/* ── Left column ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-4 md:gap-5">
            <TrekOverview trek={trek} />
            <TrekHighlights highlights={trek.highlights} />
            <TrekItinerary trek={trek} />
            <TrekInclusionsExclusions trek={trek} />
            <TrekThingsToCarry items={trek.packingItems} />
            <TrekAvailableBatches
              trek={trek}
              selectedBatchId={selectedBatchId}
              onSelectBatch={setUserSelectedBatchId}
            />
            <TrekFAQ faqs={trek.faqs} />
            <TrekSimilar />
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────── */}
          <div className="w-full lg:w-[340px] lg:shrink-0">
            <div className="lg:sticky lg:top-24">
              <BookingSidebar trek={trek} selectedBatch={selectedBatch} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
