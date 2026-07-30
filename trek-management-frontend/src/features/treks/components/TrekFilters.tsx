import { ChevronDown } from 'lucide-react'

export function TrekFilters() {
  const difficultyColors: Record<string, string> = {
    'Easy': '#10B981',      // Green
    'Moderate': '#F59E0B',  // Yellow
    'Hard': '#EF4444',      // Red
    'Challenging': '#8B5CF6' // Purple
  };

  return (
    <form 
      className="w-[260px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col text-left sticky" 
      style={{ padding: '24px', gap: '24px', top: '100px', height: 'fit-content' }}
    >
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#1C2B3A]">Filters</h2>
        <button 
          type="reset"
          className="text-[13px] font-bold text-[#F59E0B] hover:text-[#D97706] transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          Reset All
        </button>
      </div>

      {/* Search Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Search</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Trek name or location..." 
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] text-[13px] text-[#1C2B3A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A] focus:bg-white transition-all shadow-inner"
            style={{ padding: '10px 14px' }}
          />
        </div>
      </div>

      {/* Difficulty Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Difficulty</h3>
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {['Easy', 'Moderate', 'Hard', 'Challenging'].map((diff) => (
            <label key={diff} className="flex items-center cursor-pointer group" style={{ gap: '12px' }}>
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="difficulty" 
                  className="w-[18px] h-[18px] rounded-full border-2 border-[#CBD5E1] cursor-pointer appearance-none checked:border-[5px] group-hover:border-[#94A3B8] transition-all bg-white"
                  style={{ accentColor: difficultyColors[diff] }}
                />
                <style>{`
                  input[name="difficulty"][value="${diff}"]:checked {
                    border-color: ${difficultyColors[diff]} !important;
                  }
                `}</style>
              </div>
              <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#1C2B3A] transition-colors">{diff}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Duration</h3>
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {['Weekend (1-3 days)', 'Week (4-7 days)', 'Extended (8+ days)'].map((dur) => (
            <label key={dur} className="flex items-center cursor-pointer group" style={{ gap: '12px' }}>
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="duration" 
                  className="w-[18px] h-[18px] rounded-full border-2 border-[#CBD5E1] text-[#1F4D3A] focus:ring-[#1F4D3A] cursor-pointer appearance-none checked:border-[5px] checked:border-[#1F4D3A] group-hover:border-[#94A3B8] transition-all bg-white" 
                />
              </div>
              <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#1C2B3A] transition-colors">{dur}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Budget</h3>
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {['Under ₹5,000', '₹5,000 - ₹10,000', 'Above ₹10,000'].map((price) => (
            <label key={price} className="flex items-center cursor-pointer group" style={{ gap: '12px' }}>
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="budget" 
                  className="w-[18px] h-[18px] rounded-full border-2 border-[#CBD5E1] text-[#1F4D3A] focus:ring-[#1F4D3A] cursor-pointer appearance-none checked:border-[5px] checked:border-[#1F4D3A] group-hover:border-[#94A3B8] transition-all bg-white" 
                />
              </div>
              <span className="text-[14px] font-medium text-[#475569] group-hover:text-[#1C2B3A] transition-colors">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Regions Dropdown */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Region</h3>
        <div className="relative">
          <select className="w-full appearance-none bg-white border border-[#E2E8F0] rounded-[8px] py-1.5 pl-3 pr-8 text-[13px] text-[#1C2B3A] focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 focus:border-[#1F4D3A] transition-all cursor-pointer">
            <option value="">All Regions</option>
            <option value="uttarakhand">Uttarakhand</option>
            <option value="himachal">Himachal Pradesh</option>
            <option value="kashmir">Kashmir</option>
            <option value="nepal">Nepal</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
        </div>
      </div>

    </form>
  )
}
