import { ChevronDown } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

export function TrekFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const difficultyColors: Record<string, string> = {
    'EASY': '#10B981',      // Green
    'MODERATE': '#F59E0B',  // Yellow
    'DIFFICULT': '#EF4444',      // Red
    'EXTREME': '#8B5CF6' // Purple
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams(prev => {
      if (!value) {
        prev.delete(key)
      } else {
        prev.set(key, value)
      }
      prev.delete('page') // Reset page on filter change
      return prev
    })
  }

  const handleReset = () => {
    setSearchParams(new URLSearchParams())
  }

  return (
    <form 
      className="w-[260px] shrink-0 bg-card rounded-2xl shadow-sm border border-border flex flex-col text-left sticky" 
      style={{ padding: '24px', gap: '24px', top: '100px', height: 'fit-content' }}
      onSubmit={(e) => e.preventDefault()}
    >
      
      {/* Header & Reset */}
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-foreground">Filters</h2>
        <button 
          type="button"
          onClick={handleReset}
          className="text-[13px] font-bold text-[#F59E0B] hover:text-[#D97706] transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          Reset All
        </button>
      </div>

      {/* Search Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Search</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Trek name or location..." 
            value={searchParams.get('search') || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-muted border border-border rounded-[10px] text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all shadow-inner"
            style={{ padding: '10px 14px' }}
          />
        </div>
      </div>

      {/* Difficulty Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Difficulty</h3>
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {[
            { label: 'Easy', value: 'EASY' },
            { label: 'Moderate', value: 'MODERATE' },
            { label: 'Hard', value: 'DIFFICULT' },
            { label: 'Challenging', value: 'EXTREME' }
          ].map((diff) => (
            <label key={diff.value} className="flex items-center cursor-pointer group" style={{ gap: '12px' }}>
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="difficulty" 
                  value={diff.value}
                  checked={searchParams.get('difficulty') === diff.value}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-[18px] h-[18px] rounded-full border-2 border-border cursor-pointer appearance-none checked:border-[5px] hover:border-muted-foreground transition-all bg-card"
                  style={{ accentColor: difficultyColors[diff.value] }}
                />
                <style>{`
                  input[name="difficulty"][value="${diff.value}"]:checked {
                    border-color: ${difficultyColors[diff.value]} !important;
                  }
                `}</style>
              </div>
              <span className="text-[14px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{diff.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Duration</h3>
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {[
            { label: 'Weekend (1-3 days)', value: 'weekend' },
            { label: 'Week (4-7 days)', value: 'week' },
            { label: 'Extended (8+ days)', value: 'extended' }
          ].map((dur) => (
            <label key={dur.value} className="flex items-center cursor-pointer group" style={{ gap: '12px' }}>
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="duration"
                  value={dur.value}
                  checked={searchParams.get('duration') === dur.value}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="w-[18px] h-[18px] rounded-full border-2 border-border text-primary focus:ring-primary cursor-pointer appearance-none checked:border-[5px] checked:border-primary hover:border-muted-foreground transition-all bg-card" 
                />
              </div>
              <span className="text-[14px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{dur.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Budget</h3>
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {[
            { label: 'Under ₹5,000', value: 'under_5k' },
            { label: '₹5,000 - ₹10,000', value: '5k_10k' },
            { label: 'Above ₹10,000', value: 'above_10k' }
          ].map((price) => (
            <label key={price.value} className="flex items-center cursor-pointer group" style={{ gap: '12px' }}>
              <div className="relative flex items-center justify-center">
                <input 
                  type="radio" 
                  name="budget"
                  value={price.value}
                  checked={searchParams.get('budget') === price.value}
                  onChange={(e) => handleFilterChange('budget', e.target.value)}
                  className="w-[18px] h-[18px] rounded-full border-2 border-border text-primary focus:ring-primary cursor-pointer appearance-none checked:border-[5px] checked:border-primary hover:border-muted-foreground transition-all bg-card" 
                />
              </div>
              <span className="text-[14px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{price.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Regions Dropdown */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Region</h3>
        <div className="relative">
          <select 
            value={searchParams.get('region') || ''}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full appearance-none bg-card border border-border rounded-[8px] py-1.5 pl-3 pr-8 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="">All Regions</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jammu and Kashmir">Kashmir</option>
            <option value="Nepal">Nepal</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

    </form>
  )
}
