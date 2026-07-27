import { TrekCard } from '@/components/ui/TrekCard'
import { CardSkeleton } from '@/components/ui/CardSkeleton'
import type { Trek } from '@/components/ui/TrekCard'
import { Button } from '@/components/ui/button'

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
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-card bg-card/50">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No treks found</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          We couldn't find any treks matching your current filters. Try adjusting your search criteria or clearing your filters.
        </p>
        {onClearFilters && (
          <Button
            onClick={onClearFilters}
            variant="default"
          >
            Clear Filters
          </Button>
        )}
      </div>
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
