import { Backpack } from 'lucide-react'
import type { TrekPackingItemViewModel } from '../types/trekDetail'

interface TrekThingsToCarryProps {
  items: TrekPackingItemViewModel[]
  rawText: string | null
}

export function TrekThingsToCarry({ items, rawText }: TrekThingsToCarryProps) {
  if (items.length === 0 && !rawText) return null

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
        <Backpack className="w-6 h-6 text-accent" />
        Things to Carry
      </h2>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 bg-white shadow-sm rounded-xl p-3 border border-white/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <div>
                <span className="text-white/80 text-sm font-medium">{item.title}</span>
                {item.description && (
                  <p className="text-white/40 text-xs mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : rawText ? (
        <div className="bg-white shadow-sm rounded-xl p-5 border border-white/10">
          {rawText.split('\n').map((line, i) =>
            line.trim() ? (
              <div key={i} className="flex items-start gap-2.5 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span className="text-white/70 text-sm">{line.trim()}</span>
              </div>
            ) : null
          )}
        </div>
      ) : null}
    </section>
  )
}
