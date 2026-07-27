import { Hero } from '@/components/home/Hero'
import { FeaturedTreks } from '@/components/home/FeaturedTreks'
import { UpcomingDepartures } from '@/components/home/UpcomingDepartures'
import { Categories } from '@/components/home/Categories'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { Gallery } from '@/components/home/Gallery'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'
import { HERO_DATA } from '@/constants/home'

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero {...HERO_DATA} />
      <FeaturedTreks />
      <UpcomingDepartures />
      <Categories />
      <WhyChooseUs />
      <Gallery />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
