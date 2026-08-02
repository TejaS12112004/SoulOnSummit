import { TrekCard } from './TrekCard'
import { CardSkeleton } from '@/components/ui/CardSkeleton'
import { QueryErrorState } from '@/components/ui/QueryErrorState'
import { useSearchParams } from 'react-router-dom'
import type { PageResponse, TrekSummaryResponse } from '@/types/api'

interface TrekGridProps {
  data?: PageResponse<TrekSummaryResponse>
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

export function TrekGrid({ data, isLoading, isError, error, refetch }: TrekGridProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const totalPages = data?.totalPages || 0

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      prev.set('page', page.toString())
      return prev
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <div className="flex flex-col" style={{ gap: '48px', paddingBottom: '48px' }}>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" style={{ gap: '32px' }}>
        {isLoading && (
          Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))
        )}
        
        {isError && (
          <div className="col-span-full">
            <QueryErrorState error={error} onRetry={refetch} />
          </div>
        )}

        {!isLoading && !isError && data?.content.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <h3 className="text-lg font-bold mb-2">No treks found</h3>
            <p>Try adjusting your filters or search query.</p>
          </div>
        )}

        {!isLoading && !isError && data?.content.map(trek => (
          <TrekCard key={trek.id} trek={trek} />
        ))}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button 
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1 text-[14px] text-muted-foreground font-medium hover:text-foreground bg-card rounded-lg border border-border shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: '8px 12px' }}
          >
            ← Prev
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1
            const isCurrent = page === currentPage
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-lg font-bold text-[14px] shadow-sm flex items-center justify-center transition-colors ${
                  isCurrent 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {page}
              </button>
            )
          })}

          <button 
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1 text-[14px] text-muted-foreground font-medium hover:text-foreground bg-card rounded-lg border border-border shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ padding: '8px 12px' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
