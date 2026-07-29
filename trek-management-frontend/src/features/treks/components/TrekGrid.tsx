import { TrekCard } from '@/components/ui/TrekCard'
import { CardSkeleton } from '@/components/ui/CardSkeleton'
import type { Trek } from '@/components/ui/TrekCard'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchX } from 'lucide-react'

interface TrekGridProps {
  treks: Trek[]
  isLoading: boolean
  onClearFilters?: () => void
  onViewDetails?: (id: string) => void
}

export function TrekGrid({ treks, isLoading, onClearFilters, onViewDetails }: TrekGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (treks.length === 0) {
    return (
      <EmptyState
        icon={<SearchX />}
        title="No treks found"
        description="We couldn't find any treks matching your current filters. Try adjusting your search criteria or clearing your filters."
        primaryAction={onClearFilters ? (
          <Button onClick={onClearFilters}>
            Clear Filters
          </Button>
        ) : undefined}
      />
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
      {treks.map((trek) => (
        <TrekCard key={trek.id} trek={trek} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}
