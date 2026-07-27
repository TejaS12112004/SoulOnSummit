import { Check, X } from 'lucide-react'
import type { TrekInclusionViewModel, TrekExclusionViewModel } from '../types/trekDetail'

interface TrekInclusionsProps {
  inclusions: TrekInclusionViewModel[]
  exclusions: TrekExclusionViewModel[]
}

export function TrekInclusions({ inclusions, exclusions }: TrekInclusionsProps) {
  if (inclusions.length === 0 && exclusions.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-4">
        Inclusions & Exclusions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inclusions */}
        {inclusions.length > 0 && (
          <div className="bg-white shadow-sm rounded-xl p-5 border border-green-500/10">
            <h3 className="text-base font-semibold text-green-400 mb-4 flex items-center gap-2">
              <Check className="w-4 h-4" />
              What's Included
            </h3>
            <ul className="space-y-2.5">
              {inclusions.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white/80 text-sm">{item.title}</span>
                    {item.description && (
                      <p className="text-white/40 text-xs mt-0.5">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Exclusions */}
        {exclusions.length > 0 && (
          <div className="bg-white shadow-sm rounded-xl p-5 border border-red-500/10">
            <h3 className="text-base font-semibold text-red-400 mb-4 flex items-center gap-2">
              <X className="w-4 h-4" />
              Not Included
            </h3>
            <ul className="space-y-2.5">
              {exclusions.map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-white/80 text-sm">{item.title}</span>
                    {item.description && (
                      <p className="text-white/40 text-xs mt-0.5">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
