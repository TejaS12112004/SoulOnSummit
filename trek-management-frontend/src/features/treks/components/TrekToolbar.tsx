import { ChevronDown, SlidersHorizontal } from 'lucide-react'

interface TrekToolbarProps {
  isFiltersVisible: boolean;
  onToggleFilters: () => void;
}

export function TrekToolbar({ isFiltersVisible, onToggleFilters }: TrekToolbarProps) {
  return (
    <div className="flex items-center justify-between w-full" style={{ marginBottom: '24px' }}>
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleFilters}
          className="flex items-center gap-2 text-[13px] font-bold text-[#1C2B3A] bg-white border border-[#E2E8F0] rounded-[8px] hover:bg-gray-50 transition-colors shadow-sm"
          style={{ padding: '8px 12px' }}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#475569]" />
          {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className="text-[13px] text-[#475569]">
          Showing <span className="font-bold text-[#1C2B3A]">6</span> of <span className="font-bold text-[#1C2B3A]">8</span> treks
        </div>
      </div>
      
      <div className="relative">
        <select 
          className="appearance-none bg-white border border-[#E2E8F0] rounded-[8px] text-[13px] font-medium text-[#1C2B3A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A] transition-all cursor-pointer"
          style={{ padding: '8px 32px 8px 16px' }}
        >
          <option value="popular">Most Popular</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="duration">Duration: Short to Long</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
      </div>
    </div>
  )
}
