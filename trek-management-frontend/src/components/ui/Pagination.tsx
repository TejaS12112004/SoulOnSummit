import { memo } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
}

export const Pagination = memo(function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  pageSize = 20,
  pageSizeOptions = [20, 40, 60],
  onPageSizeChange
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers
  const pages = []
  const maxPagesToShow = 5

  if (totalPages <= maxPagesToShow) {
    for (let i = 0; i < totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 2) {
      pages.push(0, 1, 2, 'ellipsis', totalPages - 1)
    } else if (currentPage >= totalPages - 3) {
      pages.push(0, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1)
    } else {
      pages.push(0, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages - 1)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 mt-12 w-full max-w-[800px] mx-auto">
      
      {/* Mobile view just shows current / total instead of complex pagination */}
      <div className="sm:hidden text-sm font-medium text-muted-foreground">
        Page {currentPage + 1} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={cn(
            "h-10 px-4 rounded-lg bg-card border border-border text-[14px] font-medium transition-all shadow-sm hidden sm:flex items-center",
            currentPage === 0 
              ? "opacity-50 cursor-not-allowed text-muted-foreground" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          ← Prev
        </button>

        <div className="flex items-center gap-1.5 hidden sm:flex">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <div key={`ellipsis-${index}`} className="flex h-10 w-8 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              )
            }

            const pageNum = page as number
            const isActive = currentPage === pageNum

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center text-[14px] font-medium transition-all shadow-sm border",
                  isActive 
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" 
                    : "bg-card text-foreground border-border hover:bg-muted hover:text-foreground"
                )}
              >
                {pageNum + 1}
              </button>
            )
          })}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={cn(
            "h-10 px-4 rounded-lg bg-card border border-border text-[14px] font-medium transition-all shadow-sm hidden sm:flex items-center",
            currentPage === totalPages - 1
              ? "opacity-50 cursor-not-allowed text-muted-foreground" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Next →
        </button>
      </div>

      {onPageSizeChange && (
        <div className="flex items-center gap-2 hidden sm:flex">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-10 px-3 rounded-lg border border-border bg-card text-sm text-muted-foreground shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            aria-label="Select items per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} per page
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
})
