import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TrekFilters } from '../components/TrekFilters'
import { TrekHero } from '../components/TrekHero'
import { TrekToolbar } from '../components/TrekToolbar'
import { TrekGrid } from '../components/TrekGrid'
import { useTreks } from '@/hooks/useTreks'
import type { TrekFilterParams, SortDir } from '@/types/api'
import type { TrekDifficulty } from '@/types/difficulty'

function parseParams(searchParams: URLSearchParams): TrekFilterParams {
  const p: TrekFilterParams = {}
  
  if (searchParams.has('page')) p.page = Number(searchParams.get('page')) - 1
  if (searchParams.has('size')) p.size = Number(searchParams.get('size'))
  
  if (searchParams.has('search')) p.search = searchParams.get('search')!
  if (searchParams.has('difficulty')) p.difficulty = searchParams.get('difficulty') as TrekDifficulty
  
  if (searchParams.has('duration')) {
    const dur = searchParams.get('duration')
    if (dur === 'weekend') p.maxDurationDays = 3
    if (dur === 'week') { p.minDurationDays = 4; p.maxDurationDays = 7 }
    if (dur === 'extended') p.minDurationDays = 8
  }
  
  if (searchParams.has('budget')) {
    const b = searchParams.get('budget')
    if (b === 'under_5k') p.maxPrice = 4999
    if (b === '5k_10k') { p.minPrice = 5000; p.maxPrice = 10000 }
    if (b === 'above_10k') p.minPrice = 10001
  }
  
  if (searchParams.has('region')) p.state = searchParams.get('region')!
  
  if (searchParams.has('sortBy')) p.sortBy = searchParams.get('sortBy')!
  if (searchParams.has('sortDir')) p.sortDir = searchParams.get('sortDir') as SortDir

  return p
}

export default function TrekListingPage() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false) // hidden by default on mobile
  const [searchParams] = useSearchParams()
  const filters = parseParams(searchParams)
  
  const { data, isLoading, isError, error, refetch } = useTreks(filters)
  return (
    <div className="bg-background min-h-screen pt-[72px]">
      
      {/* Hero Section */}
      <TrekHero />

      {/* Main Content Area */}
      <div 
        id="trek-grid-section" 
        className="w-full max-w-[1300px] mx-auto px-4 md:px-6 lg:px-12 pb-24"
        style={{ paddingTop: '40px' }}
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          
          {/* Sidebar — full width on mobile when visible, fixed sidebar on desktop */}
          {isFiltersVisible && (
            <div className="w-full lg:w-[260px] lg:shrink-0 lg:sticky lg:top-[100px]">
              <TrekFilters />
            </div>
          )}
          
          {/* Main Grid Area */}
          <main className="flex-1 min-w-0 w-full flex flex-col">
            <TrekToolbar 
              isFiltersVisible={isFiltersVisible} 
              onToggleFilters={() => setIsFiltersVisible(!isFiltersVisible)}
              totalElements={data?.totalElements}
              currentElements={data?.content?.length}
            />
            <TrekGrid 
              data={data}
              isLoading={isLoading}
              isError={isError}
              error={error}
              refetch={refetch}
            />
          </main>
          
        </div>
      </div>

    </div>
  )
}
