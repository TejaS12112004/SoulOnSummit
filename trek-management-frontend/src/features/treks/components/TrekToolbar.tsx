import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

interface TrekToolbarProps {
  isFiltersVisible: boolean;
  onToggleFilters: () => void;
  totalElements?: number;
  currentElements?: number;
}

export function TrekToolbar({ isFiltersVisible, onToggleFilters, totalElements = 0, currentElements = 0 }: TrekToolbarProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSearchParams(prev => {
      if (value === 'popular') {
        prev.delete('sortBy')
        prev.delete('sortDir')
      } else if (value === 'price_low') {
        prev.set('sortBy', 'price')
        prev.set('sortDir', 'asc')
      } else if (value === 'price_high') {
        prev.set('sortBy', 'price')
        prev.set('sortDir', 'desc')
      } else if (value === 'duration') {
        prev.set('sortBy', 'durationDays')
        prev.set('sortDir', 'asc')
      }
      return prev
    })
  }

  const getSortValue = () => {
    const sortBy = searchParams.get('sortBy')
    const sortDir = searchParams.get('sortDir')
    if (sortBy === 'price' && sortDir === 'asc') return 'price_low'
    if (sortBy === 'price' && sortDir === 'desc') return 'price_high'
    if (sortBy === 'durationDays') return 'duration'
    return 'popular'
  }
  return (
    <div className="flex items-center justify-between w-full" style={{ marginBottom: '24px' }}>
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleFilters}
          className="flex items-center gap-2 text-[13px] font-bold text-foreground bg-card border border-border rounded-[8px] hover:bg-muted transition-colors shadow-sm"
          style={{ padding: '8px 12px' }}
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className="text-[13px] text-muted-foreground">
          Showing <span className="font-bold text-foreground">{currentElements}</span> of <span className="font-bold text-foreground">{totalElements}</span> treks
        </div>
      </div>
      
      <div className="relative">
        <select 
          value={getSortValue()}
          onChange={handleSortChange}
          className="appearance-none bg-card border border-border rounded-[8px] text-[13px] font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          style={{ padding: '8px 32px 8px 16px' }}
        >
          <option value="popular">Most Popular</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="duration">Duration: Short to Long</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  )
}
