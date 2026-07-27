import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TrekFilterParams } from '@/types/api'
import type { TrekDifficulty } from '@/types/difficulty'

interface TrekFiltersProps {
  filters: TrekFilterParams
  onFilterChange: (filters: Partial<TrekFilterParams>) => void
  onClear: () => void
}

const DIFFICULTIES: TrekDifficulty[] = ['EASY', 'MODERATE', 'DIFFICULT', 'EXTREME']

export function TrekFilters({ filters, onFilterChange, onClear }: TrekFiltersProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="h-8 text-sm text-accent hover:text-accent-dark hover:bg-transparent px-0 transition-colors duration-200">
          Reset All
        </Button>
      </div>

      {/* Search Input */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Search</label>
        <div className="relative">
          <Input
            placeholder="Trek name or location..."
            className="pr-9 bg-muted h-11"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onFilterChange({ search: undefined })}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-4">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Difficulty</label>
        <div className="grid grid-cols-2 gap-3">
          {DIFFICULTIES.map((diff) => {
            const isChecked = Array.isArray(filters.difficulty)
              ? filters.difficulty.includes(diff)
              : filters.difficulty === diff;

            const handleChange = () => {
              const current = Array.isArray(filters.difficulty) ? filters.difficulty : (filters.difficulty ? [filters.difficulty] : []);
              if (isChecked) {
                onFilterChange({ difficulty: current.filter((d) => d !== diff) });
              } else {
                onFilterChange({ difficulty: [...current, diff] });
              }
            };

            let selectedClass = '';
            if (diff === 'EASY') selectedClass = 'bg-success/10 text-success-foreground border-success/30 ring-success/20';
            if (diff === 'MODERATE') selectedClass = 'bg-info/10 text-info-foreground border-info/30 ring-info/20';
            if (diff === 'DIFFICULT') selectedClass = 'bg-warning/10 text-warning-foreground border-warning/30 ring-warning/20';
            if (diff === 'EXTREME') selectedClass = 'bg-destructive/10 text-destructive-foreground border-destructive/30 ring-destructive/20';

            return (
              <label key={diff} className={cn("flex flex-col items-center justify-center cursor-pointer p-4 rounded-xl border transition-all duration-200 group focus-within:ring-2 focus-within:ring-offset-1 focus-within:ring-ring text-center", isChecked ? selectedClass : "bg-transparent border-border/40 text-foreground hover:border-foreground/30 hover:bg-muted/10")} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChange(); } }}>
                <input type="checkbox" className="sr-only" checked={isChecked} onChange={handleChange} />
                <span className={cn("text-[0.7rem] font-bold tracking-widest uppercase transition-colors mb-2", isChecked ? "text-current" : "text-muted-foreground group-hover:text-foreground/90")}>
                  {diff}
                </span>
                <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors", isChecked ? "border-current" : "border-border/60 group-hover:border-foreground/40")}>
                   {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Duration (Placeholder) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Duration
          </label>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Available Soon</span>
        </div>
        <div className="flex flex-col gap-3 opacity-60">
          {['Weekend (1-3 days)', 'Week (4-7 days)', 'Extended (8+ days)'].map((dur, i) => (
             <label key={i} className="flex items-center gap-3 rounded-sm">
               <input type="checkbox" className="sr-only" disabled />
               <div className="w-4 h-4 rounded-full border border-border bg-transparent" />
               <span className="text-sm text-foreground">{dur}</span>
             </label>
          ))}
        </div>
      </div>

      {/* Budget (Placeholder) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Budget
          </label>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Available Soon</span>
        </div>
        <div className="flex flex-col gap-3 opacity-60">
          {['Under ₹5,000', '₹5,000 - ₹10,000', 'Above ₹10,000'].map((bud, i) => (
             <label key={i} className="flex items-center gap-3 rounded-sm">
               <input type="checkbox" className="sr-only" disabled />
               <div className="w-4 h-4 rounded-full border border-border bg-transparent" />
               <span className="text-sm text-foreground">{bud}</span>
             </label>
          ))}
        </div>
      </div>

      {/* Region (Placeholder) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Region
          </label>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Available Soon</span>
        </div>
        <div className="relative opacity-60">
          <select disabled className="w-full bg-input border border-border text-foreground h-12 rounded-xl px-4 text-sm appearance-none cursor-not-allowed focus:outline-none">
            <option>All Regions</option>
            <option>Uttarakhand</option>
            <option>Himachal Pradesh</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/50">
            ▼
          </div>
        </div>
      </div>
    </div>
  )
}
