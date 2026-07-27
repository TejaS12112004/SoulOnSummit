import { motion, useReducedMotion } from 'framer-motion';
import { CategoryCard } from './CategoryCard';
import { CATEGORIES_SECTION, CATEGORIES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function Categories() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section className="py-24 px-6 bg-white" aria-labelledby="categories-title">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={fadeInUp}
            className="text-accent text-[0.78rem] tracking-wider uppercase font-semibold mb-3"
          >
            {CATEGORIES_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="categories-title"
            className="font-display text-4xl lg:text-5xl font-bold text-white"
          >
            {CATEGORIES_SECTION.title}
          </motion.h2>
        </motion.div>

        {/*
          Grid: 2-col on mobile, 3-col on sm, 6-col on lg.
          Matches the Figma auto-fill minmax(220px, 1fr) intent
          while being fully responsive at all tested breakpoints.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.href} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
