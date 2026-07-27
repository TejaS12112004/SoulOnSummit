import type { TrekDetailViewModel } from '../types/trekDetail'

interface TrekOverviewProps {
  trek: TrekDetailViewModel
}

export function TrekOverview({ trek }: TrekOverviewProps) {
  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-4">About This Trek</h2>
      <div className="prose prose-invert max-w-none">
        {trek.description.split('\n').map((paragraph, i) =>
          paragraph.trim() ? (
            <p key={i} className="text-white/75 leading-relaxed mb-4 text-[0.95rem]">
              {paragraph}
            </p>
          ) : null
        )}
      </div>

      {trek.highlights.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-display font-semibold text-white mb-4">Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trek.highlights.map((h) => (
              <div
                key={h.id}
                className="flex items-start gap-3 bg-white shadow-card rounded-xl p-3 border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                <div>
                  <span className="text-white text-sm font-medium">{h.title}</span>
                  {h.description && (
                    <p className="text-white/50 text-xs mt-0.5">{h.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
