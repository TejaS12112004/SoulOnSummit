import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { SortDir } from '@/types/api'

interface TrekToolbarProps {
  totalCount: number
  sortBy: string
  sortDir: SortDir
  onSortChange: (sortBy: string, sortDir: SortDir) => void
}

export function TrekToolbar({ totalCount, sortBy, sortDir, onSortChange }: TrekToolbarProps) {
  const currentSortValue = `${sortBy}-${sortDir}`

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="text-base text-muted-foreground">
        Showing <span className="font-bold text-foreground">{totalCount}</span> {totalCount === 1 ? 'trek' : 'treks'}
      </div>
      
      <div className="flex items-center gap-2">
        <Select 
          value={currentSortValue} 
          onValueChange={(val) => {
            const [newSortBy, newSortDir] = (val || 'createdAt-desc').split('-')
            onSortChange(newSortBy, newSortDir as SortDir)
          }}
        >
          <SelectTrigger className="w-[180px] bg-muted border-border text-foreground h-10 rounded-xl focus:ring-2 focus:ring-ring focus:ring-offset-0">
            <SelectValue placeholder="Most Popular" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground">
            <SelectItem value="createdAt-desc" className="focus:bg-muted focus:text-foreground">Most Popular</SelectItem>
            <SelectItem value="durationDays-asc" className="focus:bg-muted focus:text-foreground">Duration (Short to Long)</SelectItem>
            <SelectItem value="durationDays-desc" className="focus:bg-muted focus:text-foreground">Duration (Long to Short)</SelectItem>
            <SelectItem value="title-asc" className="focus:bg-muted focus:text-foreground">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
