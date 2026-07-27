import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTrekFilters } from '../hooks/useTrekFilters'
import { useTreks } from '../hooks/useTreks'
import { TrekFilters } from '../components/TrekFilters'
import { TrekToolbar } from '../components/TrekToolbar'
import { TrekGrid } from '../components/TrekGrid'
import { Pagination } from '@/components/ui/Pagination'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toTrekDetail } from '@/constants/routes'

export default function TrekListingPage() {
  const navigate = useNavigate()
  const { filters, updateFilter, clearFilters } = useTrekFilters()
  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  // Debounce search input to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300)
    return () => clearTimeout(timer)
  }, [filters])

  const { data, isLoading, isError } = useTreks(debouncedFilters)

  const treks = data?.content || []
  const totalCount = data?.totalElements || 0
  const totalPages = data?.totalPages || 0

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Simple Header */}
      <div className="bg-forest pt-14 pb-16 px-6 border-b border-[#163629]">
        <div className="max-w-7xl mx-auto">
          <div className="text-white/60 text-sm mb-4 font-medium tracking-wide">Home -- All Treks</div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-3">Discover Your Next Adventure</h1>
          <p className="text-white/80 text-lg">
            {totalCount} treks across India's most breathtaking landscapes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger 
                render={
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                }
              />
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="py-6">
                  <TrekFilters 
                    filters={filters} 
                    onFilterChange={updateFilter} 
                    onClear={clearFilters} 
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0 pr-6 border-r border-border">
            <TrekFilters 
              filters={filters} 
              onFilterChange={updateFilter} 
              onClear={clearFilters} 
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <TrekToolbar 
              totalCount={totalCount}
              sortBy={filters.sortBy || 'createdAt'}
              sortDir={filters.sortDir || 'desc'}
              onSortChange={(sortBy, sortDir) => updateFilter({ sortBy, sortDir, page: 0 })}
            />

            {isError ? (
              <div className="p-8 text-center bg-destructive/10 text-destructive rounded-card border border-destructive/20">
                Failed to load treks. Please try again later.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TrekGrid 
                  treks={treks} 
                  isLoading={isLoading && treks.length === 0} 
                  onClearFilters={clearFilters}
                  onViewDetails={(id) => navigate(toTrekDetail(id))}
                />
                
                <Pagination 
                  currentPage={filters.page || 0}
                  totalPages={totalPages}
                  onPageChange={(page) => updateFilter({ page })}
                  pageSize={filters.size || 20}
                  onPageSizeChange={(size) => updateFilter({ size, page: 0 })}
                />
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
