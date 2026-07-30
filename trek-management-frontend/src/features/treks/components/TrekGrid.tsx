import { TrekCard } from './TrekCard'

const DUMMY_TREKS = [
  {
    id: 1,
    title: 'Triund Moonlight Trek',
    location: 'Mcleod Ganj, Himachal Pradesh',
    duration: '2 Days',
    altitude: '9,350 ft',
    difficulty: 'EASY' as const,
    price: '₹2,999',
    originalPrice: '₹3,999',
    rating: 4.7,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    nextDate: 'Jan 18, 2025',
  },
  {
    id: 2,
    title: 'Kedarkantha Summit Trek',
    location: 'Sankri, Uttarakhand',
    duration: '6 Days',
    altitude: '12,500 ft',
    difficulty: 'MODERATE' as const,
    price: '₹7,499',
    originalPrice: '₹9,499',
    rating: 4.9,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    nextDate: 'Jan 15, 2025',
  },
  {
    id: 3,
    title: 'Chandrashila Summit',
    location: 'Chopta, Uttarakhand',
    duration: '4 Days',
    altitude: '13,123 ft',
    difficulty: 'MODERATE' as const,
    price: '₹5,999',
    originalPrice: '₹7,499',
    rating: 4.7,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1626621334693-01825cba4837?auto=format&fit=crop&q=80&w=800',
    nextDate: 'Feb 2, 2025',
  },
  {
    id: 4,
    title: 'Hampta Pass Crossing',
    location: 'Manali, Himachal Pradesh',
    duration: '5 Days',
    altitude: '14,100 ft',
    difficulty: 'MODERATE' as const,
    price: '₹8,999',
    originalPrice: '₹11,999',
    rating: 4.8,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&q=80&w=800',
    nextDate: 'Jun 20, 2025',
    spotsLeft: 4,
  },
  {
    id: 5,
    title: 'Valley of Flowers',
    location: 'Chamoli, Uttarakhand',
    duration: '7 Days',
    altitude: '13,940 ft',
    difficulty: 'EASY' as const,
    price: '₹11,499',
    originalPrice: '₹14,999',
    rating: 4.9,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800',
    nextDate: 'Jul 5, 2025',
  },
  {
    id: 6,
    title: 'Brahmatal Winter Trek',
    location: 'Lohajung, Uttarakhand',
    duration: '6 Days',
    altitude: '12,250 ft',
    difficulty: 'MODERATE' as const,
    price: '₹8,499',
    originalPrice: '₹10,499',
    rating: 4.8,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    nextDate: 'Jan 22, 2025',
  }
]

export function TrekGrid() {
  return (
    <div className="flex flex-col" style={{ gap: '48px', paddingBottom: '48px' }}>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" style={{ gap: '32px' }}>
        {DUMMY_TREKS.map(trek => (
          <TrekCard key={trek.id} {...trek} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button 
          className="flex items-center gap-1 text-[14px] text-gray-500 font-medium hover:text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors"
          style={{ padding: '8px 12px' }}
        >
          ← Prev
        </button>
        <button className="w-9 h-9 rounded-lg bg-[#1F4D3A] text-white font-bold text-[14px] shadow-sm flex items-center justify-center">
          1
        </button>
        <button className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold text-[14px] shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
          2
        </button>
        <button 
          className="flex items-center gap-1 text-[14px] text-gray-500 font-medium hover:text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm transition-colors"
          style={{ padding: '8px 12px' }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
