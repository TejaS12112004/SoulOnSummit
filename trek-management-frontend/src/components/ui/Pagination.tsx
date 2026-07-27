import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
}

export function Pagination({ 
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
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="w-10 h-10 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 hidden sm:flex">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <div key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-muted" />
              </div>
            )
          }

          const pageNum = page as number
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? 'default' : 'ghost'}
              onClick={() => onPageChange(pageNum)}
              className="w-10 h-10 rounded-xl"
            >
              {pageNum + 1}
            </Button>
          )
        })}
      </div>
      
      {/* Mobile view just shows current / total */}
      <div className="sm:hidden text-sm font-medium">
        Page {currentPage + 1} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="w-10 h-10 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {onPageSizeChange && (
        <div className="flex items-center ml-4 gap-2">
          <span className="text-sm text-muted hidden sm:inline-block">Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-10 px-3 rounded-xl border border-input bg-transparent text-sm shadow-sm transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            aria-label="Select items per page"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
