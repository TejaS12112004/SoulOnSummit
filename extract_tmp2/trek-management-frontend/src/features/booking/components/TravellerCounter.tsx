import { Minus, Plus } from 'lucide-react'

interface TravellerCounterProps {
  count: number
  max: number
  onIncrement: () => void
  onDecrement: () => void
  error?: string
}

export function TravellerCounter({
  count,
  max,
  onIncrement,
  onDecrement,
  error,
}: TravellerCounterProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-display font-semibold text-white">Number of Travellers</h2>
          <p className="text-white/40 text-xs mt-0.5">
            {max} seat{max !== 1 ? 's' : ''} available for this departure
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDecrement}
            disabled={count <= 1}
            aria-label="Remove traveller"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span
            className="text-2xl font-bold text-white w-8 text-center tabular-nums"
            aria-live="polite"
            aria-label={`${count} traveller${count !== 1 ? 's' : ''}`}
          >
            {count}
          </span>

          <button
            type="button"
            onClick={onIncrement}
            disabled={count >= max}
            aria-label="Add traveller"
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-destructive text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
