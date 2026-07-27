import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';
import { WHY_CHOOSE_US_SECTION, WHY_CHOOSE_US_FEATURES } from '@/constants/home';
import { getFadeInUp, getStaggerContainer } from '@/constants/motion';

export function WhyChooseUs() {
  const shouldReduceMotion = useReducedMotion();
  const staggerContainer = getStaggerContainer(shouldReduceMotion ?? false);
  const fadeInUp = getFadeInUp(shouldReduceMotion ?? false);

  return (
    <section className="py-32 px-6 bg-beige" aria-labelledby="why-choose-us-title">
      {/*
        max-w-[1100px] is intentional — matches the Figma layout which is narrower
        than the standard PageContainer (max-w-7xl / 1280px).
      */}
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          className="text-center mb-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            variants={fadeInUp}
            className="text-accent text-[0.78rem] tracking-wider uppercase font-semibold mb-3"
          >
            {WHY_CHOOSE_US_SECTION.label}
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            id="why-choose-us-title"
            className="font-display text-4xl lg:text-5xl font-bold text-foreground"
          >
            {WHY_CHOOSE_US_SECTION.title}
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
