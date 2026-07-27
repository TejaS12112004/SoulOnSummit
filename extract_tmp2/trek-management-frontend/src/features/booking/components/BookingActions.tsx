import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function BookingActions() {
  const navigate = useNavigate()

  const handleBackToTrek = () => {
    navigate(ROUTES.TREKS)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={handleBackToTrek}
        className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 text-sm font-medium hover:border-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Treks
      </button>
    </div>
  )
}
