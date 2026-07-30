import { useState } from 'react'
import { TrekFilters } from '../components/TrekFilters'
import { TrekHero } from '../components/TrekHero'
import { TrekToolbar } from '../components/TrekToolbar'
import { TrekGrid } from '../components/TrekGrid'

export default function TrekListingPage() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(true)
  return (
    <div className="bg-[#E5E7EB] min-h-screen pt-[72px]">
      
      {/* Hero Section */}
      <TrekHero />

      {/* Main Content Area */}
      <div 
        id="trek-grid-section" 
        className="w-full max-w-[1300px] mx-auto px-6 lg:px-12 pb-24"
        style={{ paddingTop: '80px' }}
      >
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Sidebar */}
          <div 
            className="lg:sticky lg:top-[100px] z-10 transition-all duration-500 ease-in-out overflow-hidden"
            style={{ 
              maxWidth: isFiltersVisible ? '300px' : '0px',
              opacity: isFiltersVisible ? 1 : 0,
              marginLeft: isFiltersVisible ? '0' : '-40px' // Offset the gap-10 when hidden
            }}
          >
            <div className="w-[260px]">
              <TrekFilters />
            </div>
          </div>
          
          {/* Main Grid Area */}
          <main className="flex-1 min-w-0 flex flex-col transition-all duration-300">
            <TrekToolbar 
              isFiltersVisible={isFiltersVisible} 
              onToggleFilters={() => setIsFiltersVisible(!isFiltersVisible)} 
            />
            <TrekGrid />
          </main>
          
        </div>
      </div>

    </div>
  )
}
