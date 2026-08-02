import { useHomeFeaturedTreks } from '@/hooks/useHomeFeaturedTreks'
import { FeaturedTrekCard } from '@/components/home/FeaturedTreks/FeaturedTrekCard'

export function TrekSimilar() {
  const { data: featuredTreks, isLoading } = useHomeFeaturedTreks()

  if (isLoading || !featuredTreks || featuredTreks.length === 0) return null

  const similarTreks = featuredTreks.slice(0, 3)

  return (
    <section className="mt-4">
      <h2 className="text-[1.35rem] font-bold text-foreground mb-5 font-display tracking-tight">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {similarTreks.map((trek) => (
          <FeaturedTrekCard key={trek.id} trek={trek} />
        ))}
      </div>
    </section>
  )
}
