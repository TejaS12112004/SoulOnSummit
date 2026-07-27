export function TrekDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[70vh] min-h-[480px] max-h-[680px] bg-muted" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Content skeleton */}
          <div className="flex-1 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-2xl" />
              ))}
            </div>
            {/* Description lines */}
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded-sm" style={{ width: `${70 + i * 5}%` }} />
              ))}
            </div>
            {/* Itinerary */}
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-2xl" />
              ))}
            </div>
          </div>

          {/* Booking card skeleton */}
          <div className="lg:w-[360px] shrink-0">
            <div className="h-80 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
