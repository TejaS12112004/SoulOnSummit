import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FeaturedTrekCard } from './FeaturedTrekCard';
import { FEATURED_TREKS_SECTION, FEATURED_TREKS } from '@/constants/home';
import { getStaggerContainer, getFadeInUp } from '@/constants/motion';
import { motion, useReducedMotion } from 'framer-motion';

export function FeaturedTreks() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section className="py-32 px-6 bg-beige" aria-labelledby="featured-treks-title">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="text-accent text-[0.78rem] tracking-wider uppercase font-semibold mb-3">
            {FEATURED_TREKS_SECTION.label}
          </motion.div>
          <motion.h2 variants={fadeInUp} id="featured-treks-title" className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-bold text-foreground leading-[1.1]">
            {FEATURED_TREKS_SECTION.title}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted-foreground mt-5 max-w-[540px] mx-auto text-[1.05rem] leading-relaxed">
            {FEATURED_TREKS_SECTION.description}
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {FEATURED_TREKS.map((trek) => (
            <FeaturedTrekCard key={trek.id} trek={trek} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild className="bg-forest text-white hover:bg-forest/90 px-12 py-4 text-[1.05rem] rounded-xl h-auto font-medium transition-transform active:scale-95">
            <Link to={FEATURED_TREKS_SECTION.viewAllLink}>
              {FEATURED_TREKS_SECTION.viewAllText}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
